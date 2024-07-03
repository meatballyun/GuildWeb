import { useNavigate } from 'react-router';
import { Button, MaterialSymbol } from '../../../components';
import { COLORS } from '../../../styles';
import { Link } from 'react-router-dom';
import { Membership } from '../../../api/guild/interface';

interface ActionsButtonsProps {
  isCabin?: boolean;
  editMode?: boolean;
  guildId?: string;
  myMemberShip?: Membership;
  onSubmit?: () => void;
  onLeave: () => void;
  onDelete: () => void;
}

export const ActionsButtons = ({
  isCabin,
  editMode,
  guildId,
  myMemberShip,
  onSubmit,
  onLeave,
  onDelete,
}: ActionsButtonsProps) => {
  const navigate = useNavigate();
  const isNewGuild = guildId === 'new';
  const isGuildMaster = myMemberShip === 'Master';

  if (editMode)
    return (
      <>
        {!isNewGuild && (
          <div className="border-r-2 border-primary-300 pr-2">
            <Button
              className="h-full"
              style={{ background: COLORS.red }}
              size="md"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        )}
        <Button onClick={() => navigate(-1)} type="hollow" size="md">
          Cancel
        </Button>
        <Button size="md" onClick={onSubmit}>
          {isNewGuild ? 'Create' : 'Save'}
        </Button>
      </>
    );
  return (
    <>
      {!isCabin && isGuildMaster && (
        <Link to="edit">
          <Button type="hollow" prefix={<MaterialSymbol icon="settings" />}>
            Manage
          </Button>
        </Link>
      )}
      {!isCabin && !isGuildMaster && (
        <div className="border-r-2 border-primary-300 pr-2">
          <Button
            className="h-full"
            style={{ borderColor: COLORS.red, color: COLORS.red }}
            type="hollow"
            size="md"
            onClick={onLeave}
          >
            Leave
          </Button>
        </div>
      )}
      <Link to="missions">
        <Button prefix={<MaterialSymbol icon="event_note" />}>Missions</Button>
      </Link>
    </>
  );
};
