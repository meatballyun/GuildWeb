import { useState } from 'react';
import { Input, type InputProps, MaterialSymbol } from '../../components';

export const PasswordInput = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="border-b border-b-currentColor pb-1">
      <div className="flex rounded-sm bg-primary-100 pr-2">
        <Input
          {...props}
          inputClassName="bg-transparent"
          className="w-full"
          inputType={showPassword ? 'text' : 'password'}
        />
        <MaterialSymbol
          fill
          className="cursor-pointer"
          icon={showPassword ? 'visibility_off' : 'visibility'}
          onClick={() => setShowPassword((show) => !show)}
        />
      </div>
    </div>
  );
};
