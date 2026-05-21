
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Submission failed');
      
      setIsSuccess(true);
      window.scrollTo({ top: document.getElementById('register-form')?.offsetTop, behavior: 'smooth' });
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="text-primary text-6xl animate-pulse">✦</div>
        <h3 className="text-4xl font-headline font-bold">Jazakum Allahu Khayran.</h3>
        <p className="text-muted-foreground italic max-w-md mx-auto">
          Your application is being reviewed by the Imamah board. We will reach out shortly regarding your club's induction.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-primary text-xs uppercase tracking-widest mt-10 hover:underline"
        >
          Submit another team
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label className="uppercase text-[10px] tracking-widest text-muted-foreground" htmlFor="teamName">Team Name</Label>
          <Input name="teamName" id="teamName" required className="bg-background/50 border-primary/20 focus:border-primary" />
        </div>
        
        <div className="space-y-2">
          <Label className="uppercase text-[10px] tracking-widest text-muted-foreground" htmlFor="sport">Sport</Label>
          <Select name="sport" required>
            <SelectTrigger className="bg-background/50 border-primary/20 focus:border-primary">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soccer">Soccer</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="american-football">American Football</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="uppercase text-[10px] tracking-widest text-muted-foreground" htmlFor="city">City / Region</Label>
          <Input name="city" id="city" required className="bg-background/50 border-primary/20" />
        </div>

        <div className="space-y-2">
          <Label className="uppercase text-[10px] tracking-widest text-muted-foreground" htmlFor="yearFounded">Year Founded</Label>
          <Input name="yearFounded" id="yearFounded" type="number" className="bg-background/50 border-primary/20" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="uppercase text-[10px] tracking-widest text-muted-foreground" htmlFor="about">About the Team</Label>
        <Textarea name="about" id="about" className="bg-background/50 border-primary/20 min-h-[120px]" placeholder="Share your club's history and philosophy..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
        <div className="space-y-2">
          <Label className="uppercase text-[10px] tracking-widest text-muted-foreground" htmlFor="contactName">Contact Name</Label>
          <Input name="contactName" id="contactName" required className="bg-background/50 border-primary/20" />
        </div>

        <div className="space-y-2">
          <Label className="uppercase text-[10px] tracking-widest text-muted-foreground" htmlFor="contactEmail">Contact Email</Label>
          <Input name="contactEmail" id="contactEmail" type="email" required className="bg-background/50 border-primary/20" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="uppercase text-[10px] tracking-widest text-muted-foreground" htmlFor="website">Website / Social (Optional)</Label>
        <Input name="website" id="website" placeholder="https://" className="bg-background/50 border-primary/20" />
      </div>

      <div className="pt-6">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full btn-luxury h-12"
        >
          {isSubmitting ? 'PROCESSING...' : 'SUBMIT REGISTRATION'}
        </Button>
      </div>
    </form>
  );
}
