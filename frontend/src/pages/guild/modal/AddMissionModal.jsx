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

const validateObject = {
  name: (value) => {
    if (!value) return 'name is required';
  },
  type: (value) => {
    if (!value) return 'type is required';
  },
  repetitiveTaskType: (value, { type }) => {
    if (type === 'Repetitive' && !value)
      return 'repetitiveTaskType is required';
  },
  maxAdventurer: (value) => {
    if (!value || value === '0') return 'maxAdventurer is required';
  },
  initiationTime: (value) => {
    if (!value) return 'initiationTime is required';
    if (new Date() - new Date(value) < 0)
      return 'initiationTime should bigger than ';
  },
  deadline: (value, { initiationTime }) => {
    if (!value) return 'deadline is required';
    if (new Date(value) - new Date(initiationTime) < 0)
      return 'deadline should bigger than initiationTime';
  },
  items: (value) => {
    if (value?.some(({ content }) => !content))
      return 'content should not be empty';
  },
};

const defaultValue = {
  initiationTime: new Date(),
  deadline: new Date(),
  type: 'Ordinary',
  maxAdventurer: 1,
};

export const AddMissionModal = ({
  modalStatus,
  onClose,
  onFinish,
  ...props
}) => {
  useEffect(() => {
    form.setFormData({ ...modalStatus?.formData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalStatus]);

  const form = useFormInstance({
    validateObject,
    onSubmit: async (formData) => {
      await onFinish?.(formData);
      onClose?.();
    },
    defaultValue,
  });

  return (
    <Modal
      {...props}
      isOpen={modalStatus.isOpen}
      onClose={onClose}
      header="Add Mission"
      footButton={
        <Button
          size="md"
          className="w-full justify-center"
          onClick={form.submit}
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
