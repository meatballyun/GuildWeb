import { useRef } from 'react';
import { MaterialSymbol } from './MaterialSymbol';
import { classNames } from '../utils';
import { api } from '../api';

const MAX_FILE_SIZE_MB = 5;

export const ImageUploader = ({ value, type, onChange, className }) => {
  const inputElement = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB.`);
      return;
    } else if (!file.type.startsWith('image/')) {
      alert(
        'Please select an image file (supported formats: JPEG, PNG, GIF, etc.).'
      );
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const res = await api.upload.uploadImage({
          body: {
            image: reader.result,
            type,
          },
        });
        if (res.status === 200) {
          const { data } = await res.json();
          onChange(data.imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={classNames('relative flex w-full items-center', className)}>
      <input
        hidden
        ref={inputElement}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {value ? (
        <div
          className="h-[50vh] w-full"
          style={{
            backgroundImage: value && `url("${value}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        <div className="h-[50vh] w-full" />
      )}
      <div className="absolute inset-0 flex cursor-pointer items-center justify-center gap-2 bg-primary-100/50 opacity-0 transition-all hover:opacity-100">
        <div
          className="rounded-full bg-white p-2"
          onClick={() => inputElement.current.click()}
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
            onClick={() => onChange(null)}
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
    </div>
  );
};
