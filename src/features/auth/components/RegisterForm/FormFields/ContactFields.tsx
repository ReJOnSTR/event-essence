import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactFields({ form }) {
  return (
    <div className="space-y-4">
      <FormField
        name="email"
        control={form.control}
        render={({ field }) => (
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Email adresiniz" {...field} />
          </div>
        )}
      />
      <FormField
        name="phoneNumber"
        control={form.control}
        render={({ field }) => (
          <div>
            <Label htmlFor="phoneNumber">Telefon</Label>
            <Input id="phoneNumber" type="tel" placeholder="Telefon numaranız" {...field} />
          </div>
        )}
      />
    </div>
  );
}