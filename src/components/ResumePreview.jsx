"use client";

import DynamicTemplate from "@/components/templates/DynamicTemplate";

export default function ResumePreview({ templateId, data }) {
  return <DynamicTemplate templateId={templateId} data={data} />;
}
