import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, Save, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile, signOut } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ display_name: displayName, avatar_url: avatarUrl, bio });
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save profile.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 sm:pb-0">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(160 84% 39% / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.12) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-mono uppercase tracking-wider">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold">Profile</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="relative z-10 max-w-lg mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-3">
          <Avatar className="w-20 h-20 mx-auto ring-2 ring-primary/30">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
            <AvatarFallback className="bg-primary/15 text-primary text-xl font-mono font-bold border border-primary/30">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-xs font-mono text-muted-foreground">{user.email}</p>
        </div>

        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Personal Info</CardTitle>
            <CardDescription className="text-xs font-mono uppercase tracking-wider">Update your display name, avatar, and bio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Avatar URL</Label>
              <Input id="avatarUrl" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.png" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Bio</Label>
              <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Button variant="outline" onClick={() => { signOut(); navigate('/'); }} className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
          Sign Out
        </Button>
      </main>
    </div>
  );
};

export default Profile;
