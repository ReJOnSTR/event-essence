import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SecurityFields({ form }) {
  return (
    <FormField
      name="password"
      control={form.control}
      render={({ field }) => (
        <div>
          <Label htmlFor="password">Şifre</Label>
          <Input id="password" type="password" placeholder="Şifreniz" {...field} />
        </div>
      )}
    />
  );
}