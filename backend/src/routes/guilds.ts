import express from 'express';
import { verifyToken } from '../utils/verification';
import { isMember, isMasterOrVice, isMaster } from '../middleware/guildAuth';
import {
  getGuilds,
  getGuildDetail,
  addGuild,
  addCabin,
  updateGuild,
  deleteGuild,
  replyInvitation,
  getMembers,
  updateMember,
  deleteMember,
  getMissionTemplates,
  getMissionTemplateDetail,
  addMissionTemplate,
  updateMissionTemplate,
  deleteMissionTemplate,
  getUserMissions,
  getMissions,
  getMissionDetail,
  addMission,
  updateMission,
  deleteMission,
  acceptMission,
  abandonMission,
  completeMission,
  failMission,
  cancelMission,
  restoreMission,
  submitMission,
  clickCheckboxForItemRecord,
  sendGuildInvitation,
} from '../controllers/guild';

const router = express.Router();

// Guild
router.get('/', verifyToken, getGuilds);
router.get('/:gid', verifyToken, isMember, getGuildDetail);
router.post('/', verifyToken, addGuild);
router.post('/cabin', verifyToken, addCabin);
router.put('/:gid', verifyToken, isMaster, updateGuild);
router.delete('/:gid', verifyToken, isMaster, deleteGuild);

// Member
router.get('/:gid/invitation', verifyToken, isMember, replyInvitation);
router.get('/:gid/members', verifyToken, isMember, getMembers);
router.post('/:gid/invitation', verifyToken, isMasterOrVice, sendGuildInvitation);
router.patch('/:gid/members/:uid', verifyToken, isMaster, updateMember);
router.delete('/:gid/members/:uid', verifyToken, isMember, deleteMember);

// MissionTemplate
router.get('/:gid/mission_templates', verifyToken, isMasterOrVice, getMissionTemplates);
router.get('/:gid/mission_templates/:ttid', verifyToken, isMasterOrVice, getMissionTemplateDetail);
router.post('/:gid/mission_templates', verifyToken, isMasterOrVice, addMissionTemplate);
router.put('/:gid/mission_templates/:ttid', verifyToken, isMasterOrVice, updateMissionTemplate);
router.delete('/:gid/mission_templates/:ttid', verifyToken, isMasterOrVice, deleteMissionTemplate);

// Mission
router.get('/all/missions', verifyToken, getUserMissions);
router.get('/:gid/missions', verifyToken, getMissions);
router.get('/:gid/missions/:tid', verifyToken, isMember, getMissionDetail);
router.post('/:gid/missions/', verifyToken, isMasterOrVice, addMission);
router.put('/:gid/missions/:tid', verifyToken, isMasterOrVice, updateMission);
router.delete('/:gid/missions/:tid', verifyToken, isMember, deleteMission);

// Mission action
router.get('/:gid/missions/:tid/accepted', verifyToken, isMember, acceptMission);
router.get('/:gid/missions/:tid/abandon', verifyToken, isMember, abandonMission);
router.patch('/:gid/missions/:tid/complete', verifyToken, isMasterOrVice, completeMission);
router.patch('/:gid/missions/:tid/fail', verifyToken, isMasterOrVice, failMission);
router.patch('/:gid/missions/:tid/cancel', verifyToken, isMasterOrVice, cancelMission);
router.patch('/:gid/missions/:tid/restore', verifyToken, isMasterOrVice, restoreMission);
router.patch('/:gid/missions/:tid/submit', verifyToken, isMember, submitMission);
router.patch('/:gid/missions/checkbox', verifyToken, isMember, clickCheckboxForItemRecord);

export default router;
