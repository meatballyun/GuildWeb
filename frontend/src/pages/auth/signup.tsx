import { APIError, api } from '../../api';
import {
  Button,
  Form,
  FormOnSubmit,
  Input,
  useFormInstance,
  useNotification,
  validate,
} from '../../components';
import { useState } from 'react';
import { Paper } from '../_layout/components';
import { EmailModal } from './modal';
import { PasswordInput } from './component';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validateObject = {
  name: [validate.required, validate.maxLimit(50)],
  email: [validate.required, validate.maxLimit(100), validate.isEmail],
  password: [validate.required, validate.maxLimit(30), validate.minLimit(6)],
  confirmPassword: [validate.required, validate.isEqual('password')],
};

export const SignUp = () => {
  const [modalStatus, setModalStatus] = useState<{
    isOpen: boolean;
    sendEmailTime?: number;
  }>({
    isOpen: false,
    sendEmailTime: 0,
  });
  const {
    Dom: Notification,
    value: notification,
    promptNotification,
  } = useNotification();

  const handleSignUp: FormOnSubmit<FormData> = async ({
    confirmPassword,
    ...data
  }) => {
    promptNotification({ type: 'loading' });
    const [success, error] = await api.auth
      .signUp({ data })
      .then((value) => [value, null] as const)
      .catch((err: APIError) => [null, err] as const);

    if (success && !error) {
      setModalStatus({ isOpen: true, sendEmailTime: new Date().valueOf() });
      promptNotification({
        type: 'success',
        message: 'Create account successfully',
      });
      return;
    }

    switch (error.status) {
      case 409:
        promptNotification({
          type: 'error',
          message: 'This email address is already in use',
        });
        return;
      default:
        promptNotification({
          type: 'error',
          message: 'unknown server error',
        });
    }
  };

  const form = useFormInstance({ validateObject, onSubmit: handleSignUp });

  return (
    <>
      <Paper className="flex h-[720px] w-[600px] flex-col items-center justify-center">
        <div className="mb-8 text-center text-heading-h1">
          Become an adventurer!
        </div>
        <div className="flex w-[240px] flex-col gap-4">
          <Notification />
          <Form form={form}>
            <Form.Item valueKey="name" label="Name">
              <Input type="underline" />
            </Form.Item>
            <Form.Item valueKey="email" label="Email">
              <Input type="underline" />
            </Form.Item>
            <Form.Item valueKey="password" label="Password">
              <PasswordInput />
            </Form.Item>
            <Form.Item valueKey="confirmPassword" label="Confirm Password">
              <PasswordInput />
            </Form.Item>
          </Form>
        </div>
        <Button
          size="lg"
          className="mt-12"
          onClick={() => form.submit?.()}
          disabled={notification?.type === 'loading'}
        >
          Start your journey
        </Button>
      </Paper>
      <EmailModal
        {...modalStatus}
        header="The verification Email has been sent"
        description={`Certification confirmation should take a few minutes, or check your spam folder for the verification email.\n\nDidn’t receive it? Click the button below to resend the verification email`}
        onClose={() => setModalStatus({ isOpen: false })}
        email={form.formData.email}
      />
    </>
  );
};
