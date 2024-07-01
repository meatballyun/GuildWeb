export class DEFAULT_NOTIFICATION_CONTENT {
  senderName: string;
  receiverName: string;

  constructor(senderName: string, receiverName: string) {
    this.senderName = senderName;
    this.receiverName = receiverName;
  }

  guild() {
    const content = {
      title: `Invitation to Join the "${this.senderName}" Adventurer's Guild`,
      description: `Dear ${this.receiverName},
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
      title: `Friend Request from ${this.senderName}`,
      description: `Dear ${this.receiverName},
        You have received a friend request from ${this.senderName}!  They would like to add you as a friend.
        If you would like to accept their request, please click the "Accept" button.
        
        Best regards,
        ${this.senderName}`,
    };

    return content;
  }

  system() {
    const content = {
      title: 'Welcome to GuildWeb!',
      description: `Dear ${this.receiverName},
        Welcome to GuildWeb! We're thrilled to have you join our community dedicated to health and organization.
        
        With GuildWeb, you have access to a powerful platform for managing your daily nutrition goals, tracking your tasks, and collaborating with others to achieve shared objectives. 
        Whether you're looking to optimize your diet, streamline your tasks, or engage in group activities, GuildWeb is here to support you every step of the way.
        
        We're excited for you to explore all the features and benefits our platform has to offer. Should you have any questions or need assistance, please don't hesitate to reach out to our support team.

        Once again, welcome to GuildWeb! We're excited to embark on this journey with you.
        
        Best regards,
        Yun-T.Z.
        GuildWeb Team`,
    };

    return content;
  }
}
