import { useEffect } from 'react';
import {
  Button,
  DatePicker,
  DropdownSelect,
  Form,
  Input,
  MaterialSymbol,
  ValidateObj,
  useFormInstance,
  validate,
} from '../../../components';
import { Modal, ModalProps } from '../../../components/Modal';
import { TextArea } from '../../../components/Form/TextArea';
import { Mission, MissionTemplate } from '../../../api/guild/interface';
import { MissionPageMode } from '../MissionPage/interface';
import { ModalStatus } from '../MissionPage';

interface CheckListItemProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

const CheckListItem = ({ value, onChange, onRemove }: CheckListItemProps) => {
  return (
    <div className="flex">
      <Input value={value} onChange={onChange} className="w-full" />
      <MaterialSymbol icon="do_not_disturb_on" size={20} onClick={onRemove} />
    </div>
  );
};

interface ItemType extends Omit<Mission['items'][0], 'content' | 'id'> {
  content: null | string;
  id?: string;
}

interface CheckListProps {
  value?: ItemType[];
  onChange?: (value: ItemType[]) => void;
}

const CheckList = ({ value = [], onChange }: CheckListProps) => {
  const handleItemChange = (v: string, index: number) => {
    const newValue = [...value];
    newValue[index].content = v;
    onChange?.(newValue);
  };

  const handleItemRemove = (index: number) => {
    const newValue = [...value];
    newValue[index].content = null;
    onChange?.(newValue);
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
        onClick={() => onChange?.([...value, { content: '' }])}
      >
        add item
      </Button>
    </div>
  );
};

const validateObject: Record<string, ValidateObj[]> = {
  name: [validate.required],
  type: [validate.required],
  repetitiveMissionType: [
    ({ value }, { type }) => {
      if (type === 'Repetitive' && !value)
        throw Error('repetitiveMissionType is required');
    },
  ],
  maxAdventurer: [
    validate.required,
    validate.minLimit(1, 'number'),
    validate.isInt,
  ],
  initiationTime: [
    validate.required,
    ({ value }: { value: Mission['initiationTime'] }) => {
      if (
        new Date(value).valueOf() -
          new Date(new Date().toDateString()).valueOf() <
        0
      )
        throw Error('initiationTime should bigger than Today');
    },
  ],
  deadline: [
    validate.required,
    (
      { value }: { value: Mission['deadline'] },
      { initiationTime }: Mission
    ) => {
      if (
        new Date(value).valueOf() -
          new Date(new Date(initiationTime).toDateString()).valueOf() <
        0
      )
        throw Error('deadline should bigger than initiationTime');
    },
  ],
  items: [
    ({ value }: { value: Mission['items'] }) => {
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
} as unknown as Mission;

interface AddMissionModalProps extends ModalProps {
  modalStatus: ModalStatus;
  onFinish?: (value: Mission | MissionTemplate) => Promise<void>;
  mode?: MissionPageMode;
}

export const AddMissionModal = ({
  modalStatus,
  onClose,
  onFinish,
  mode,
  ...props
}: AddMissionModalProps) => {
  const form = useFormInstance<Mission | MissionTemplate>({
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
        mode === MissionPageMode.TEMPLATE
          ? `${modalStatus.type ?? 'Add'} Template Mission`
          : `${modalStatus.type ?? 'Add'} Mission`
      }
      footButton={[{ onClick: form.submit, children: 'Submit' }]}
    >
      <Form form={form}>
        <div className="flex h-[500px] w-full flex-col gap-4 overflow-auto p-2">
          <Form.Item valueKey="name" label="Name">
            <Input type="underline" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-2">
            {mode === MissionPageMode.MANAGE && (
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
            {mode === MissionPageMode.TEMPLATE && (
              <Form.Item valueKey="type" label="Type">
                <DropdownSelect
                  className="w-full"
                  placeholder="select repetitive Mission Type"
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
              label={
                mode === MissionPageMode.TEMPLATE
                  ? 'GenerationTime'
                  : 'InitiationTime'
              }
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
