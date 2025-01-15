import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PersonalInfoFields({ form }) {
  return (
    <div className="space-y-4">
      <FormField
        name="firstName"
        control={form.control}
        render={({ field }) => (
          <div>
            <Label htmlFor="firstName">Ad</Label>
            <Input id="firstName" placeholder="Adınız" {...field} />
          </div>
        )}
      />
      <FormField
        name="lastName"
        control={form.control}
        render={({ field }) => (
          <div>
            <Label htmlFor="lastName">Soyad</Label>
            <Input id="lastName" placeholder="Soyadınız" {...field} />
          </div>
        )}
      />
    </div>
  );
}