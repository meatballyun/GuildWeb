import { useEffect } from 'react';
import {
  Button,
  DatePicker,
  DropdownSelect,
  Form,
  Input,
  MaterialSymbol,
  useFormInstance,
  validate,
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
    const newValue = [...value];
    newValue[index].content = null;
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      {value?.map(({ content }, i) => {
        if (content === null) return null;
        return (
          <CheckListItem
            key={i}
            value={content}
            onChange={(v) => handleItemChange(v, i)}
            onRemove={() => handleItemRemove(i)}
          />
        );
      })}
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
  name: [validate.required],
  type: [validate.required],
  repetitiveTaskType: [
    ({ value }, { type }) => {
      if (type === 'Repetitive' && !value)
        throw Error('repetitiveTaskType is required');
    },
  ],
  maxAdventurer: [
    validate.required,
    validate.minLimit(1, 'number'),
    validate.isInt,
  ],
  initiationTime: [
    validate.required,
    ({ value }) => {
      if (new Date(value) - new Date(new Date().toDateString()) < 0)
        throw Error('initiationTime should bigger than Today');
    },
  ],
  deadline: [
    validate.required,
    ({ value }, { initiationTime }) => {
      if (
        new Date(value) - new Date(new Date(initiationTime).toDateString()) <
        0
      )
        throw Error('deadline should bigger than initiationTime');
    },
  ],
  items: [
    ({ value }) => {
      if (value?.some(({ content }) => !content && content !== null))
        throw Error('content should not be empty');
    },
  ],
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
  mode,
  ...props
}) => {
  const form = useFormInstance({
    validateObject,
    onSubmit: async (formData) => {
      const currentType = Array.isArray(formData.type)
        ? formData.type[0]
        : formData.type;

      await onFinish?.({ ...formData, type: currentType });
      onClose?.();
    },
    defaultValue,
  });

  useEffect(() => {
    form.setFormData({ ...defaultValue, ...modalStatus.formData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalStatus]);

  return (
    <Modal
      {...props}
      isOpen={modalStatus.isOpen}
      onClose={onClose}
      header={
        mode === 'template'
          ? `${modalStatus.type ?? 'Add'} Template Mission`
          : `${modalStatus.type ?? 'Add'} Mission`
      }
      footButton={[{ onClick: form.submit, text: 'Submit' }]}
    >
      <Form form={form}>
        <div className="flex h-[500px] w-full flex-col gap-4 overflow-auto p-2">
          <Form.Item valueKey="name" label="Name">
            <Input type="underline" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-2">
            {mode === 'manage' && (
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
                  ]}
                />
              </Form.Item>
            )}
            {mode === 'template' && (
              <Form.Item valueKey="type" label="Type">
                <DropdownSelect
                  className="w-full"
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

            <Form.Item
              valueKey="maxAdventurer"
              className="w-full"
              label="Max Adventurer"
            >
              <Input type="underline" inputType="number" min={1} />
            </Form.Item>
          </div>
          <div className="flex">
            <Form.Item
              valueKey="initiationTime"
              label={mode === 'template' ? 'GenerationTime' : 'InitiationTime'}
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
