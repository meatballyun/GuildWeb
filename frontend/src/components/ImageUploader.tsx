import { useRef } from 'react';
import { MaterialSymbol } from './MaterialSymbol';
import { classNames } from '../utils';
import { api } from '../api';
import { Image } from './Image';
import { useNotification } from './Notification';

const MAX_FILE_SIZE_MB = 5;

interface ImageUploaderProps {
  value?: string;
  // for folder name
  type: string;
  onChange?: (value: string | null) => void;
  className?: string;
  disabled?: boolean;
}

export const ImageUploader = ({
  value,
  type,
  onChange,
  className,
  disabled = false,
}: ImageUploaderProps) => {
  const inputElement = useRef<HTMLInputElement>(null);
  const { Dom, promptNotification } = useNotification();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    promptNotification({ type: 'loading' });
    if (!file) {
      promptNotification({
        type: 'error',
        message: 'no file',
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      promptNotification({
        type: 'error',
        message: `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB.`,
      });
      return;
    }
    if (!file.type.startsWith('image/')) {
      promptNotification({
        type: 'error',
        message:
          'Please select an image file (supported formats: JPEG, PNG, GIF, etc.)',
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const [success] = await api.upload
        .uploadImage({
          data: {
            image: reader.result,
            type,
          },
        })
        .then((data) => [data, null] as const)
        .catch((err) => [null, err] as const);

      if (success) {
        onChange?.(success.imageUrl);
        promptNotification();
        return;
      }

      promptNotification({ type: 'error', message: 'upload failed' });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={classNames(
        'relative flex h-full w-full items-center justify-center',
        className
      )}
    >
      <input
        hidden
        ref={inputElement}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <div className="absolute top-2 z-10">
        <Dom />
      </div>
      {value ? (
        <Image className="h-full w-full" url={value} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary-100">
          <MaterialSymbol
            icon="imagesmode"
            className="text-primary-200"
            size={72}
          />
        </div>
      )}
      {/* upper button */}
      {!disabled && (
        <div className="absolute inset-0 flex cursor-pointer items-center justify-center gap-2 bg-primary-100/50 opacity-0 transition-all hover:opacity-100">
          <div
            className="rounded-full bg-white p-2"
            onClick={() => inputElement.current?.click()}
          >
            <MaterialSymbol
              className="text-primary-300"
              icon="upload"
              size={48}
            />
          </div>
          {value && (
            <div
              className="rounded-full bg-red p-2"
              onClick={() => onChange?.(null)}
            >
              <MaterialSymbol
                className="text-white"
                icon="delete"
                fill
                size={48}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
