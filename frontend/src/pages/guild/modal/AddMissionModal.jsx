import { useEffect } from 'react';
import {
  Button,
  DatePicker,
  DropdownSelect,
  Form,
  Input,
  MaterialSymbol,
  useFormInstance,
} from '../../../components';
import { Modal } from '../../../components/Modal';
import { TextArea } from '../../../components/Form/TextArea';

const CheckListItem = ({ value, onChange, onRemove }) => {
  return (
    <div className="flex">
      <Input value={value} onChange={onChange} className="w-full" />
      <MaterialSymbol icon="do_not_disturb_on" size={20} onClick={onRemove} />
    </div>
  );
};

const CheckList = ({ value = [], onChange }) => {
  const handleItemChange = (v, index) => {
    const newValue = [...value];
    newValue[index].content = v;
    onChange(newValue);
  };

  const handleItemRemove = (index) => {
    const newValue = [...value].filter((_, i) => i !== index);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      {value?.map(({ content }, i) => (
        <CheckListItem
          value={content}
          onChange={(v) => handleItemChange(v, i)}
          onRemove={() => handleItemRemove(i)}
        />
      ))}
      <Button
        type="hollow"
        onClick={() => onChange([...value, { content: '' }])}
      >
        add item
      </Button>
    </div>
  );
};

export const AddMissionModal = ({ isOpen, onClose, onFinish, ...props }) => {
  const form = useFormInstance({});

  useEffect(() => {
    form.setFormData({});
  }, [isOpen]);

  const handleClick = async () => {
    await onFinish?.(form.formData);
    onClose?.();
  };

  return (
    <Modal
      {...props}
      isOpen={isOpen}
      onClose={onClose}
      header="Add Mission"
      footButton={
        <Button
          size="md"
          className="w-full justify-center"
          onClick={handleClick}
        >
          Submit
        </Button>
      }
    >
      <Form form={form}>
        <div className="flex h-[500px] w-full flex-col gap-4 overflow-auto p-2">
          <Form.Item valueKey="name" label="Name">
            <Input type="underline" />
          </Form.Item>
          <div className="flex gap-2">
            <Form.Item valueKey="type" label="type" className="w-full">
              <DropdownSelect
                placeholder="select type"
                options={[
                  {
                    value: 'Ordinary',
                    label: 'Ordinary',
                  },
                  {
                    value: 'Emergency',
                    label: 'Emergency',
                  },
                  {
                    value: 'Repetitive',
                    label: 'Repetitive',
                  },
                ]}
              />
            </Form.Item>
            {form.formData.type === 'Repetitive' && (
              <Form.Item
                valueKey="repetitiveTaskType"
                label="Repetitive Tasks Type"
                className="w-full"
              >
                <DropdownSelect
                  placeholder="select repetitive Task Type"
                  options={[
                    {
                      value: 'Daily',
                      label: 'Daily',
                    },
                    {
                      value: 'Weekly',
                      label: 'Weekly',
                    },
                    {
                      value: 'Monthly',
                      label: 'Monthly',
                    },
                  ]}
                />
              </Form.Item>
            )}
          </div>

          <Form.Item valueKey="maxAdventurer" label="Max Adventurer">
            <Input type="underline" inputType="number" />
          </Form.Item>
          <div className="flex">
            <Form.Item
              valueKey="initiationTime"
              label="InitiationTime"
              className="w-full"
            >
              <DatePicker />
            </Form.Item>
            <Form.Item valueKey="deadline" label="Deadline" className="w-full">
              <DatePicker />
            </Form.Item>
          </div>

          <Form.Item valueKey="description" label="description">
            <TextArea className="h-[200px]" placeholder="text something..." />
          </Form.Item>

          <Form.Item valueKey="items" label="Check List">
            <CheckList />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
