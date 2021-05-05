import ClassService from '../../components/classes/ClassService';
import AssignmentService from '../../components/assignments/AssignmentService';

const classes = require('./classObj.json');

export default async function seedClasses() {
  try {
    const hasBeenSeeded = await ClassService.findOne({
      key: Object.keys(classes[0])[0],
    });

    if (hasBeenSeeded) return;

    let admin = await AssignmentService.findOne({
      email: 'assignment@admin.user',
    });

    if (!admin) {
      admin = await AssignmentService.createOne({
        email: 'assignment@admin.user',
      });
    }

    const data = classes.map((classObj) => ({
      key: Object.keys(classObj)[0],
      value: Object.values(classObj)[0],
      assignment: admin.id,
    }));

    return await ClassService.createMany(data);
  } catch (error) {
    console.log('Error seeding classes: ', error);
  }
}
