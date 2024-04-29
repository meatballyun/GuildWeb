import { api } from '../api';
import { Button, Loading } from '../components';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../components/Modal';

export const EmailModal = ({
  email,
  sendEmailTime: propSendEmailTime,
  isOpen,
  ...props
}) => {
  const [sendEmailTime, setSendEmailTime] = useState(new Date().valueOf());
  const [currentTime, setCurrentTime] = useState(new Date().valueOf());
  const [loading, setLoading] = useState(false);
  const count = useMemo(() => {
    if (!sendEmailTime || !currentTime) return;
    return 60 - ((currentTime - sendEmailTime) / 1000).toFixed(0);
  }, [sendEmailTime, currentTime]);

  useEffect(() => {
    setSendEmailTime(propSendEmailTime);
  }, [propSendEmailTime]);

  useEffect(() => {
    if (count <= 0) return;
    const timer = setInterval(() => {
      setCurrentTime(new Date().valueOf());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [sendEmailTime, propSendEmailTime, count]);

  const handleResendEmail = async () => {
    setLoading(true);
    await api.auth.resendEmail({ body: { email } });
    setLoading(false);
    setSendEmailTime(new Date().valueOf());
    setCurrentTime(new Date().valueOf());
  };

  return (
    <Modal {...props} isOpen={isOpen}>
      <div className="flex h-40 flex-col items-center justify-center gap-4 text-center text-paragraph-p3">
        Didn’t receive it? Click the button below to resend the verification
        email
      </div>
      <div>
        <Button
          disabled={loading || count > 0}
          className="m-auto"
          type="hollow"
          onClick={handleResendEmail}
        >
          {(() => {
            if (loading) return <Loading />;
            if (count > 0)
              return `After ${count} seconds, you can try resending the verification email.`;
            return 'resend the verification email';
          })()}
        </Button>
      </div>
    </Modal>
  );
};
