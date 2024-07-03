import express from 'express';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { GuildAuth } from '../middleware/guildAuth';
import { GuildController } from '../controllers/guild/guild';
import { memberController } from '../controllers/guild/member';
import { MissionController } from '../controllers/guild/mission';
import { MissionTemplateController } from '../controllers/guild/missionTemplate';
import { verifyToken } from '../utils/verification';

const router = express.Router();

// Guild
router.get('/', verifyToken, awaitHandlerFactory(GuildController.getGuilds));
router.get('/:gid', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(GuildController.getGuildDetail));
router.post('/', verifyToken, awaitHandlerFactory(GuildController.addGuild));
router.post('/cabin', verifyToken, awaitHandlerFactory(GuildController.addCabin));
router.put('/:gid', verifyToken, awaitHandlerFactory(GuildAuth.isMaster), awaitHandlerFactory(GuildController.updateGuild));
router.delete('/:gid', verifyToken, awaitHandlerFactory(GuildAuth.isMaster), awaitHandlerFactory(GuildController.deleteGuild));

// Member
router.get('/:gid/invitation', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(memberController.replyInvitation));
router.get('/:gid/members', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(memberController.getMembers));
router.post('/:gid/invitation', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(memberController.sendInvitation));
router.patch('/:gid/members/:uid', verifyToken, awaitHandlerFactory(GuildAuth.isMaster), awaitHandlerFactory(memberController.updateMember));
router.delete('/:gid/members/:uid', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(memberController.deleteMember));

// MissionTemplate
router.get('/:gid/mission_templates', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.getMissionTemplates));
router.get('/:gid/mission_templates/:ttid', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.getMissionTemplateDetail));
router.post('/:gid/mission_templates', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.addMissionTemplate));
router.put('/:gid/mission_templates/:ttid', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.updateMissionTemplate));
router.delete('/:gid/mission_templates/:ttid', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionTemplateController.deleteMissionTemplate));

// Mission
router.get('/all/missions', verifyToken, awaitHandlerFactory(MissionController.getUserMissions));
router.get('/:gid/missions', verifyToken, awaitHandlerFactory(MissionController.getMissions));
router.get('/:gid/missions/:tid', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.getMissionDetail));
router.post('/:gid/missions/', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.addMission));
router.put('/:gid/missions/:tid', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.updateMission));
router.delete('/:gid/missions/:tid', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.deleteMission));

// Mission action
router.get('/:gid/missions/:tid/accepted', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.acceptMission));
router.get('/:gid/missions/:tid/abandon', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.abandonMission));
router.patch('/:gid/missions/:tid/complete', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.completeMission));
router.patch('/:gid/missions/:tid/fail', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.failMission));
router.patch('/:gid/missions/:tid/cancel', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.cancelMission));
router.patch('/:gid/missions/:tid/restore', verifyToken, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(MissionController.restoreMission));
router.patch('/:gid/missions/:tid/submit', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.submitMission));
router.patch('/:gid/missions/checkbox', verifyToken, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(MissionController.clickCheckboxForItemRecord));

export default router;
