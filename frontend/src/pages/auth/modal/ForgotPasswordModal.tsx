import { APIError, api } from '../../../api';
import {
  Button,
  Form,
  Input,
  useFormInstance,
  useNotification,
  validate,
} from '../../../components';
import { Modal } from '../../../components/Modal';

export const ForgotPasswordModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { Dom, value: notification, promptNotification } = useNotification();

  const handleSubmit = async (formData: { email: string }) => {
    promptNotification({ type: 'loading' });
    const [success, err] = await api.auth
      .resetPasswordEmail({ data: formData })
      .then((data) => [data])
      .catch((err) => [null, err]);

    if (success && !err) {
      promptNotification({
        type: 'success',
        message: 'email send successfully',
      });
      setTimeout(() => {
        onClose?.();
      }, 3000);
      return;
    }
    if ((err as APIError).status === 404) {
      promptNotification({
        type: 'error',
        message: 'This email has not been registered yet',
      });
      return;
    }

    promptNotification({
      type: 'error',
      message: 'unknown server error',
    });
    return;
  };
  const form = useFormInstance({
    validateObject: {
      email: [validate.required, validate.isEmail],
    },
    onSubmit: handleSubmit,
  });

  return (
    <Modal header="Forgot Password" isOpen={isOpen} onClose={onClose}>
      <div className="mb-4 rounded-sm px-4 py-2 text-paragraph-p3 text-primary-600">
        Kindly provide your email address to initiate the process of resetting
        your password.
        <br />
        Upon submission, you will receive a verification email containing
        instructions on how to proceed.
      </div>
      <Dom className="mb-2" />
      <Form form={form}>
        <div className="mb-4 flex w-full items-start gap-2">
          <Form.Item
            className="w-full items-center"
            layout="row"
            label="Email"
            valueKey="email"
          >
            <Input inputClassName="h-[32px]" />
          </Form.Item>
          <Button
            onClick={form.submit}
            disabled={['loading', 'success'].includes(notification?.type ?? '')}
          >
            send
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
