'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, Input } from '@/components/ui';
import { PixelIcon } from '@/components/icons/PixelIcon';

export default function ClubsPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the email to a backend
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />

      <main className="flex-1">
        <div className="container-page py-12 md:py-20">
          {/* Coming Soon Banner */}
          <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] mb-8">
            <div className="bg-[var(--bg-tertiary)] px-4 py-2 border-b border-[var(--border-primary)]">
              <span className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] text-[var(--text-secondary)]">
                Coming Soon
              </span>
            </div>
            <div className="p-6 md:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 border border-[var(--border-primary)] flex items-center justify-center bg-[var(--bg-primary)]">
                <PixelIcon name="users" size={32} className="text-[var(--text-secondary)]" />
              </div>
              <h1 className="font-[family-name:var(--font-display)] fs-h-lg md:fs-h-xl uppercase mb-4">
                Book Clubs
              </h1>
              <p className="font-[family-name:var(--font-ui)] fs-p-lg text-[var(--text-secondary)] max-w-lg mx-auto mb-8 leading-relaxed">
                Read together with friends. Share progress, discuss chapters, and stay accountable with group reading goals.
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px] bg-[var(--border-primary)] border border-[var(--border-primary)] mb-8 max-w-2xl mx-auto">
                <div className="bg-[var(--bg-primary)] p-4 md:p-6 text-center">
                  <PixelIcon name="share" size={24} className="text-[var(--text-secondary)] mb-3 mx-auto" />
                  <h3 className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] mb-2">
                    Shared Progress
                  </h3>
                  <p className="font-[family-name:var(--font-ui)] fs-p-sm text-[var(--text-tertiary)]">
                    See where everyone is in the book
                  </p>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 md:p-6 text-center">
                  <PixelIcon name="message-circle" size={24} className="text-[var(--text-secondary)] mb-3 mx-auto" />
                  <h3 className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] mb-2">
                    Discussions
                  </h3>
                  <p className="font-[family-name:var(--font-ui)] fs-p-sm text-[var(--text-tertiary)]">
                    Comment and discuss passages
                  </p>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 md:p-6 text-center">
                  <PixelIcon name="calendar" size={24} className="text-[var(--text-secondary)] mb-3 mx-auto" />
                  <h3 className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] mb-2">
                    Reading Pace
                  </h3>
                  <p className="font-[family-name:var(--font-ui)] fs-p-sm text-[var(--text-tertiary)]">
                    Set group reading schedules
                  </p>
                </div>
              </div>

              {/* Email Signup */}
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                  <p className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] text-[var(--text-secondary)] mb-4">
                    Get notified when Book Clubs launches
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="email"
                      placeholder="YOUR EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button type="submit" className="w-full sm:w-auto">
                      <PixelIcon name="bell" size={12} className="mr-2" />
                      Notify Me
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="max-w-md mx-auto p-4 border border-[var(--border-primary)] bg-[var(--bg-primary)]">
                  <div className="flex items-center gap-3 justify-center">
                    <PixelIcon name="check-circle" size={20} className="text-[var(--text-primary)]" />
                    <span className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em]">
                      You&apos;ll be notified when we launch!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border-primary)] border border-[var(--border-primary)]">
            <div className="bg-[var(--bg-secondary)] p-6 md:p-8">
              <h2 className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] mb-4 flex items-center gap-2">
                <PixelIcon name="link" size={16} />
                Invite Friends
              </h2>
              <p className="font-[family-name:var(--font-ui)] fs-p-lg text-[var(--text-secondary)] leading-relaxed">
                Create a club and share an invite link. Anyone with the link can join and start reading together.
              </p>
            </div>
            <div className="bg-[var(--bg-secondary)] p-6 md:p-8">
              <h2 className="font-[family-name:var(--font-ui)] fs-p-sm uppercase tracking-[0.05em] mb-4 flex items-center gap-2">
                <PixelIcon name="fire" size={16} />
                Group Streaks
              </h2>
              <p className="font-[family-name:var(--font-ui)] fs-p-lg text-[var(--text-secondary)] leading-relaxed">
                Keep each other accountable with group reading streaks. See who&apos;s reading and who needs encouragement.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
