import express from 'express';
import passport from '../utils/verification/passport';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { GuildAuth } from '../middleware/guildAuth';
import { GuildController } from '../controllers/guild/guild';
import { memberController } from '../controllers/guild/member';
import { MissionController } from '../controllers/guild/mission';
import { MissionTemplateController } from '../controllers/guild/missionTemplate';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: true });

// Guild
router.get('/', auth, awaitHandlerFactory(GuildController.getGuilds));
router.get('/:gid', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(GuildController.getGuildDetail));
router.post('/', auth, awaitHandlerFactory(GuildController.addGuild));
router.post('/cabin', auth, awaitHandlerFactory(GuildController.addCabin));
router.put('/:gid', auth, awaitHandlerFactory(GuildAuth.isMaster), awaitHandlerFactory(GuildController.updateGuild));
router.delete('/:gid', auth, awaitHandlerFactory(GuildAuth.isMaster), awaitHandlerFactory(GuildController.deleteGuild));

// Member
router.get('/:gid/invitation', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(memberController.replyInvitation));
router.get('/:gid/members', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(memberController.getMembers));
router.post('/:gid/invitation', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(memberController.sendInvitation));
router.patch('/:gid/members/:uid', auth, awaitHandlerFactory(GuildAuth.isMaster), awaitHandlerFactory(memberController.updateMember));
router.delete('/:gid/members/:uid', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(memberController.deleteMember));

// MissionTemplate
router.get('/:gid/mission_templates', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.getMissionTemplates));
router.get('/:gid/mission_templates/:ttid', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.getMissionTemplateDetail));
router.post('/:gid/mission_templates', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.addMissionTemplate));
router.put('/:gid/mission_templates/:ttid', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.updateMissionTemplate));
router.delete('/:gid/mission_templates/:ttid', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.deleteMissionTemplate));

// Mission
router.get('/all/missions', auth, awaitHandlerFactory(MissionController.getUserMissions));
router.get('/:gid/missions', auth, awaitHandlerFactory(MissionController.getMissions));
router.get('/:gid/missions/:tid', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.getMissionDetail));
router.post('/:gid/missions/', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.addMission));
router.put('/:gid/missions/:tid', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.updateMission));
router.delete('/:gid/missions/:tid', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.deleteMission));

// Mission action
router.get('/:gid/missions/:tid/accepted', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.acceptMission));
router.get('/:gid/missions/:tid/abandon', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.abandonMission));
router.patch('/:gid/missions/:tid/complete', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.completeMission));
router.patch('/:gid/missions/:tid/fail', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.failMission));
router.patch('/:gid/missions/:tid/cancel', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.cancelMission));
router.patch('/:gid/missions/:tid/restore', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.restoreMission));
router.patch('/:gid/missions/:tid/submit', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.submitMission));
router.patch('/:gid/missions/checkbox', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.clickCheckboxForItemRecord));

export default router;
