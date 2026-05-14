export const awardBadges = (student, activity) => {
  let newBadges = [];
  let points = 0;
  switch (activity) {
    case 'first_meeting':
      if (!student.badges.includes('First Meeting')) newBadges.push('First Meeting');
      points = 50;
      break;
    case 'completed_task':
      if (student.points >= 200 && !student.badges.includes('Task Master')) newBadges.push('Task Master');
      points = 20;
      break;
    case 'code_review':
      if (!student.badges.includes('Code Reviewer')) newBadges.push('Code Reviewer');
      points = 30;
      break;
    default: break;
  }
  return { newBadges, points };
};