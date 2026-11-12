import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "inquiries");

// Regex validations
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_PIN_REGEX = /^[1-9][0-9]{5}$/;
const PHONE_DIGITS_REGEX = /\d/g;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data: Record<string, any> = {};
    let uploadedFileMeta: { originalName: string; size: number; savedAs?: string } | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const entries: Array<[string, FormDataEntryValue]> = [];
      formData.forEach((value, key) => {
        entries.push([key, value]);
      });

      for (const [key, value] of entries) {
        if (key === "projectFile" && value instanceof File && value.size > 0) {
          // File validation
          if (value.size > 5 * 1024 * 1024) {
            return NextResponse.json(
              {
                success: false,
                errors: { projectFile: "Uploaded file exceeds the maximum 5MB size limit." },
              },
              { status: 400 }
            );
          }

          const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/heic",
            "application/pdf",
          ];
          if (!allowedTypes.includes(value.type)) {
            return NextResponse.json(
              {
                success: false,
                errors: {
                  projectFile: "Unsupported file type. Please upload a JPG, PNG, WEBP, or PDF file.",
                },
              },
              { status: 400 }
            );
          }

          // Save file securely
          await fs.mkdir(UPLOADS_DIR, { recursive: true });
          const safeName = `${Date.now()}-${value.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
          const filePath = path.join(UPLOADS_DIR, safeName);
          const bytes = await value.arrayBuffer();
          await fs.writeFile(filePath, Buffer.from(bytes));

          uploadedFileMeta = {
            originalName: value.name,
            size: value.size,
            savedAs: `/uploads/inquiries/${safeName}`,
          };
        } else if (typeof value === "string") {
          data[key] = value.trim();
        }
      }
    } else {
      data = await req.json();
    }

    // 1. Honeypot check (anti-spam)
    if (data.website_hp && data.website_hp.length > 0) {
      // Silently discard bot submission while returning faux success
      return NextResponse.json({
        success: true,
        leadId: `FC-BOT-${Math.floor(1000 + Math.random() * 9000)}`,
        message: "Inquiry received.",
      });
    }

    // 2. Server-side field validation
    const errors: Record<string, string> = {};

    if (!data.fullName || data.fullName.length < 2) {
      errors.fullName = "Please enter your full name (minimum 2 characters).";
    }

    if (!data.email || !EMAIL_REGEX.test(data.email)) {
      errors.email = "Please enter a valid email address.";
    }

    const phoneDigits = (data.phone || "").match(PHONE_DIGITS_REGEX) || [];
    if (phoneDigits.length < 10) {
      errors.phone = "Please enter a valid 10-digit telephone number.";
    }

    if (!data.zipCode || !INDIAN_PIN_REGEX.test(data.zipCode)) {
      errors.zipCode = "Please enter a valid 6-digit Indian PIN code (e.g. 560001).";
    }

    if (!data.propertyType) {
      errors.propertyType = "Please select your property type.";
    }

    if (!data.fenceType) {
      errors.fenceType = "Please select your preferred fencing material.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors,
        },
        { status: 400 }
      );
    }

    // 3. Generate verified unique lead ID
    const leadId = `FC-IN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newLead = {
      id: leadId,
      createdAt: new Date().toISOString(),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      zipCode: data.zipCode,
      preferredContactMethod: data.preferredContactMethod || "Phone Call",
      propertyType: data.propertyType,
      fenceType: data.fenceType,
      fenceLength: data.fenceLength || "Not specified",
      fenceHeight: data.fenceHeight || "Standard",
      gatesCount: data.gatesCount || "0",
      timeline: data.timeline || "Within 1 Month",
      description: data.description || "",
      fileAttachment: uploadedFileMeta,
      clientIp: req.headers.get("x-forwarded-for") || "local",
      userAgent: req.headers.get("user-agent") || "",
    };

    // 4. Lead Persistence: Atomic local JSON append
    await fs.mkdir(DATA_DIR, { recursive: true });
    let existingLeads: any[] = [];
    try {
      const fileData = await fs.readFile(INQUIRIES_FILE, "utf-8");
      existingLeads = JSON.parse(fileData);
      if (!Array.isArray(existingLeads)) existingLeads = [];
    } catch {
      existingLeads = [];
    }

    existingLeads.push(newLead);
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify(existingLeads, null, 2), "utf-8");

    // 5. CRM / Webhook forwarding integration point (if configured)
    if (process.env.LEAD_WEBHOOK_URL) {
      try {
        await fetch(process.env.LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLead),
        });
      } catch (webhookErr) {
        console.error("CRM Webhook dispatch failed:", webhookErr);
      }
    }

    // 6. Email notification integration point (if Resend is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "FenceCo India Leads <leads@fenceco.in>",
            to: [process.env.INQUIRY_NOTIFICATION_EMAIL || "info@fenceco.in"],
            subject: `New Fencing Estimate Request: ${newLead.fullName} (${newLead.fenceType})`,
            html: `
              <h2>New Lead Received #${newLead.id}</h2>
              <p><strong>Name:</strong> ${newLead.fullName}</p>
              <p><strong>Email:</strong> ${newLead.email}</p>
              <p><strong>Phone:</strong> ${newLead.phone}</p>
              <p><strong>PIN Code:</strong> ${newLead.zipCode}</p>
              <p><strong>Preferred Contact:</strong> ${newLead.preferredContactMethod}</p>
              <p><strong>Property Type:</strong> ${newLead.propertyType}</p>
              <p><strong>Fencing Material:</strong> ${newLead.fenceType}</p>
              <p><strong>Estimated Footage:</strong> ${newLead.fenceLength}</p>
              <p><strong>Gates:</strong> ${newLead.gatesCount}</p>
              <p><strong>Timeline:</strong> ${newLead.timeline}</p>
              <p><strong>Project Description:</strong> ${newLead.description || "None provided"}</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Lead email alert dispatch failed:", emailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        leadId,
        message: "Your fencing estimate request has been securely received.",
        summary: {
          fullName: newLead.fullName,
          fenceType: newLead.fenceType,
          zipCode: newLead.zipCode,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing fencing inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process your request at this time. Please try again or call our office directly.",
      },
      { status: 500 }
    );
  }
}
