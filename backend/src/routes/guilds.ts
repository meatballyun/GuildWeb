import express from 'express';
import { verifyToken } from '../utils/token/verification';
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

// Guild // gid: Guild ID
// Get all users' Guilds.
router.get('/', verifyToken, getGuilds);

// Get information for the specified Guild.
router.get('/:gid', verifyToken, isMember, getGuildDetail);

// Create a Guild.
router.post('/', verifyToken, addGuild);

// Create a Cabin.
router.post('/cabin', verifyToken, addCabin);

// Update a Guild.
router.put('/:gid', verifyToken, isMaster, updateGuild);

// Delete a Guild.
router.delete('/:gid', verifyToken, isMaster, deleteGuild);

// Member // uid: User ID, gid: Guild ID
// Respond to a guild invitation.
router.get('/:gid/invitation', verifyToken, isMember, replyInvitation);

// Get all members of the Guild.
router.get('/:gid/members', verifyToken, isMember, getMembers);

// Send an invitation letter to invite the user to join the Guild.
router.post('/:gid/invitation', verifyToken, isMasterOrVice, sendGuildInvitation);

// Update guild member membership.
router.patch('/:gid/members/:uid', verifyToken, isMaster, updateMember);

// Delete a guild member or leave the Guild.
router.delete('/:gid/members/:uid', verifyToken, isMember, deleteMember);

// MissionTemplate // gid: Guild ID, mtid: Mission Template ID
// Get all Mission Templates of the Guild.
router.get('/:gid/mission_templates', verifyToken, isMasterOrVice, getMissionTemplates);

// Get the specified detail of Mission Template.
router.get('/:gid/mission_templates/:mtid', verifyToken, isMasterOrVice, getMissionTemplateDetail);

// Create a Mission Template.
router.post('/:gid/mission_templates', verifyToken, isMasterOrVice, addMissionTemplate);

// Update the Mission Template.
router.put('/:gid/mission_templates/:mtid', verifyToken, isMasterOrVice, updateMissionTemplate);

// Delete the Mission Template.
router.delete('/:gid/mission_templates/:mtid', verifyToken, isMasterOrVice, deleteMissionTemplate);

// Mission // gid: Guild ID, mid: Mission ID
// Get all Missions assigned to users.
router.get('/all/missions', verifyToken, getUserMissions);

// Get all Missions for the specified guild.
router.get('/:gid/missions', verifyToken, getMissions);

// Get details of the specified Mission.
router.get('/:gid/missions/:mid', verifyToken, isMember, getMissionDetail);

// Create a Mission.
router.post('/:gid/missions/', verifyToken, isMasterOrVice, addMission);

// Update a Mission.
router.put('/:gid/missions/:mid', verifyToken, isMasterOrVice, updateMission);

// Delete a Mission.
router.delete('/:gid/missions/:mid', verifyToken, isMember, deleteMission);

// Mission Action //gid: Guild ID, mid: Mission ID, irid: Item Record ID
// Take on the specified mission.
router.patch('/:gid/missions/:mid/accepted', verifyToken, isMember, acceptMission);

// Abandon taking on a mission.
router.patch('/:gid/missions/:mid/abandon', verifyToken, isMember, abandonMission);

// Confirm mission completion.
router.patch('/:gid/missions/:mid/complete', verifyToken, isMasterOrVice, completeMission);

// Confirm that the mission has failed.
router.patch('/:gid/missions/:mid/fail', verifyToken, isMasterOrVice, failMission);

// Cancel the publication of this mission
router.patch('/:gid/missions/:mid/cancel', verifyToken, isMasterOrVice, cancelMission);

// Re-publish the mission
router.patch('/:gid/missions/:mid/restore', verifyToken, isMasterOrVice, restoreMission);

// Submit a mission that has been taken on
router.patch('/:gid/missions/:mid/submit', verifyToken, isMember, submitMission);

// Change the status of a mission item
router.patch('/:gid/missions/checkbox/:irid', verifyToken, isMember, clickCheckboxForItemRecord);

export default router;
