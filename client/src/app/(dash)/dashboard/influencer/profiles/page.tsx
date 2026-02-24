"use client";

import { useState } from "react";
import { Card } from "@/components/kits/card";
import { Button } from "@/components/kits/button";
import { Modal } from "@/components/kits/modal";
import { Field } from "@/components/kits/field";
import { Input } from "@/components/kits/input";
import { useMyProfiles, useCreateProfile } from "@/hooks/api-hooks";
import { Instagram, Twitter, Youtube, UserPlus, Trash2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilesPage() {
  const { data: profiles, isLoading } = useMyProfiles();
  const { mutate: createProfile, isPending } = useCreateProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platform, setPlatform] = useState("instagram");
  const [handle, setHandle] = useState("");

  const handleCreate = () => {
    createProfile({ platform, handle }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setHandle("");
      }
    });
  };

  const getPlatformIcon = (p: string) => {
    switch (p.toLowerCase()) {
      case "instagram": return <Instagram size={24} />;
      case "twitter": return <Twitter size={24} />;
      case "youtube": return <Youtube size={24} />;
      default: return <ExternalLink size={24} />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Social Profiles</h1>
          <p className="text-white/40 mt-2">Connect your social platforms to unlock more campaigns.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-12 px-8">
          <UserPlus size={18} className="mr-2" /> Add Profile
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />)}
        </div>
      ) : !profiles || profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
            <UserPlus size={40} className="text-white/10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No profiles connected</h2>
          <p className="text-white/40 mb-8 max-w-sm">Connect your Instagram, Twitter, or YouTube to start applying for elite campaigns.</p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">Connect your first profile</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile: any, i: number) => (
            <motion.div
              key={profile._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="flex flex-col items-center justify-center py-10">
                <div className="mb-6 h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-brand-primary">
                  {getPlatformIcon(profile.platform)}
                </div>
                <h3 className="text-2xl font-bold text-white capitalize">{profile.platform}</h3>
                <p className="text-white/40 mt-1">@{profile.handle}</p>

                <div className="mt-8 flex gap-3">
                  <Button variant="ghost" className="h-10 w-10 p-0 text-red-400 hover:bg-red-400/10">
                    <Trash2 size={18} />
                  </Button>
                  <Button variant="outline" className="h-10">View Analytics</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Social Profile">
        <div className="space-y-6">
          <Field label="Platform">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-brand-primary/50"
            >
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="youtube">YouTube</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Social Handle">
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@username"
            />
          </Field>

          <Button onClick={handleCreate} className="w-full h-12" disabled={isPending}>
            {isPending ? "Connecting..." : "Connect Profile"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
