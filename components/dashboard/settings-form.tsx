"use client";

import { Loader2, Save, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import {
  type UserSettingsInput,
  upsertUserSettings,
} from "@/actions/user-settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type UserSettings = {
  id: string;
  userId: string;
  newsletterName: string | null;
  description: string | null;
  targetAudience: string | null;
  defaultTone: string | null;
  brandVoice: string | null;
  companyName: string | null;
  industry: string | null;
  disclaimerText: string | null;
  defaultTags: string[];
  customFooter: string | null;
  senderName: string | null;
  senderEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface SettingsFormProps {
  initialSettings: UserSettings | null;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");

  const [formData, setFormData] = React.useState<UserSettingsInput>({
    newsletterName: initialSettings?.newsletterName || "",
    description: initialSettings?.description || "",
    targetAudience: initialSettings?.targetAudience || "",
    defaultTone: initialSettings?.defaultTone || "",
    brandVoice: initialSettings?.brandVoice || "",
    companyName: initialSettings?.companyName || "",
    industry: initialSettings?.industry || "",
    disclaimerText: initialSettings?.disclaimerText || "",
    defaultTags: initialSettings?.defaultTags || [],
    customFooter: initialSettings?.customFooter || "",
    senderName: initialSettings?.senderName || "",
    senderEmail: initialSettings?.senderEmail || "",
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const cleanedData: UserSettingsInput = {
        newsletterName: formData.newsletterName?.trim() || null,
        description: formData.description?.trim() || null,
        targetAudience: formData.targetAudience?.trim() || null,
        defaultTone: formData.defaultTone?.trim() || null,
        brandVoice: formData.brandVoice?.trim() || null,
        companyName: formData.companyName?.trim() || null,
        industry: formData.industry?.trim() || null,
        disclaimerText: formData.disclaimerText?.trim() || null,
        defaultTags: formData.defaultTags || [],
        customFooter: formData.customFooter?.trim() || null,
        senderName: formData.senderName?.trim() || null,
        senderEmail: formData.senderEmail?.trim() || null,
      };

      await upsertUserSettings(cleanedData);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    field: keyof UserSettingsInput,
    value: string | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.defaultTags?.includes(trimmedTag)) {
      handleChange("defaultTags", [
        ...(formData.defaultTags || []),
        trimmedTag,
      ]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange(
      "defaultTags",
      formData.defaultTags?.filter((tag) => tag !== tagToRemove) || [],
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const inputStyles = "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500";
  const labelStyles = "text-slate-300";

  return (
    <div className="max-w-4xl space-y-6">
      {/* Basic Information */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-semibold text-white">Basic Information</h3>
          <p className="text-slate-400 mt-1">
            Core details about your newsletter that will be used in every generation
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newsletterName" className={labelStyles}>Newsletter Name</Label>
            <Input
              id="newsletterName"
              placeholder="e.g., Tech Weekly Digest"
              value={formData.newsletterName || ""}
              onChange={(e) => handleChange("newsletterName", e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className={labelStyles}>Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your newsletter's purpose and content"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className={inputStyles}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience" className={labelStyles}>Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Software developers, tech enthusiasts, startup founders"
              value={formData.targetAudience || ""}
              onChange={(e) => handleChange("targetAudience", e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultTone" className={labelStyles}>Default Tone</Label>
            <Input
              id="defaultTone"
              placeholder="e.g., Professional, casual, friendly, informative"
              value={formData.defaultTone || ""}
              onChange={(e) => handleChange("defaultTone", e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* Brand Identity */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-semibold text-white">Brand Identity</h3>
          <p className="text-slate-400 mt-1">
            Your brand's voice and company information
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className={labelStyles}>Company Name</Label>
            <Input
              id="companyName"
              placeholder="Your company or organization name"
              value={formData.companyName || ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className={labelStyles}>Industry</Label>
            <Input
              id="industry"
              placeholder="e.g., Technology, Healthcare, Finance"
              value={formData.industry || ""}
              onChange={(e) => handleChange("industry", e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandVoice" className={labelStyles}>Brand Voice</Label>
            <Textarea
              id="brandVoice"
              placeholder="Describe your brand's unique voice and personality"
              value={formData.brandVoice || ""}
              onChange={(e) => handleChange("brandVoice", e.target.value)}
              rows={3}
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-semibold text-white">Additional Details</h3>
          <p className="text-slate-400 mt-1">
            Extra information to enhance your newsletters
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultTags" className={labelStyles}>Default Tags</Label>
            <div className="flex gap-2">
              <Input
                id="defaultTags"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={inputStyles}
              />
              <Button 
                type="button" 
                onClick={handleAddTag} 
                variant="secondary"
                className="bg-slate-700 hover:bg-slate-600 text-white border-0"
              >
                Add
              </Button>
            </div>
            {formData.defaultTags && formData.defaultTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.defaultTags.map((tag) => (
                  <Badge key={tag} className="gap-1 bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-400"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="disclaimerText" className={labelStyles}>Disclaimer Text</Label>
            <Textarea
              id="disclaimerText"
              placeholder="Any legal disclaimers or notices to include"
              value={formData.disclaimerText || ""}
              onChange={(e) => handleChange("disclaimerText", e.target.value)}
              rows={3}
              className={inputStyles}
            />
            <p className="text-xs text-slate-500">
              This will be included near the end of every newsletter body
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customFooter" className={labelStyles}>Custom Footer</Label>
            <Textarea
              id="customFooter"
              placeholder="Custom footer content for your newsletters"
              value={formData.customFooter || ""}
              onChange={(e) => handleChange("customFooter", e.target.value)}
              rows={4}
              className={inputStyles}
            />
            <p className="text-xs text-slate-500">
              This will be included at the very end of every newsletter body
            </p>
          </div>
        </div>
      </div>

      {/* Sender Information */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-semibold text-white">Sender Information</h3>
          <p className="text-slate-400 mt-1">
            Who is sending these newsletters?
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senderName" className={labelStyles}>Sender Name</Label>
            <Input
              id="senderName"
              placeholder="e.g., John Doe"
              value={formData.senderName || ""}
              onChange={(e) => handleChange("senderName", e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderEmail" className={labelStyles}>Sender Email</Label>
            <Input
              id="senderEmail"
              type="email"
              placeholder="e.g., john@example.com"
              value={formData.senderEmail || ""}
              onChange={(e) => handleChange("senderEmail", e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
