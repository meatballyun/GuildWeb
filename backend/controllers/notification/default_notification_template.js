class DEFAULT_NOTIFICATION_CONTENT {
  constructor(senderName, receiverName) {
    this.senderName = senderName;
    this.receiverName = receiverName;
  }

  guild() {
    const content = {
      TITLE: `Invitation to Join the "${this.senderName}" Adventurer's Guild`,
      DESCRIPTION: `Dear ${this.receiverName},
      We cordially invite you to join our adventurer's guild, "${this.senderName}"! In our guild, you'll have the opportunity to explore unknown worlds, tackle thrilling quests and adventures alongside other adventurous comrades.
      Our guild is committed to providing a warm and friendly environment where every member can find their place and enjoy the thrill of adventure. Whether you're a novice or a seasoned adventurer, you're welcome to join us!
      If you are interested in our guild, we sincerely invite you to join our ranks! Please click the "Join Us" button to accept our invitation, and we will arrange for your membership.
      Sincerely,
  
      Adventurer's Guild "${this.senderName}"`,
    };

    return content;
  }

  user() {
    const content = {
      TITLE: `Friend Request from ${this.senderName}`,
      DESCRIPTION: `Dear ${this.receiverName},
        You have received a friend request from ${this.senderName}!  They would like to add you as a friend.
        If you would like to accept their request, please click the "Accept" button.
        
        Best regards,
        ${this.senderName}`,
    };

    return content;
  }
}

module.exports = DEFAULT_NOTIFICATION_CONTENT;
