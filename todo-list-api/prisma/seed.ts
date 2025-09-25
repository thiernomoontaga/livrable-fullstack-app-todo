import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'thier.segnane@example.com' },
    update: {},
    create: {
      email: 'thier.segnane@example.com',
      password: hashedPassword1,
      name: 'Thierno segnane',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'marie.ndiaye@example.com' },
    update: {},
    create: {
      email: 'marie.ndiaye@example.com',
      password: hashedPassword2,
      name: 'Maie Ndiaye',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'bakary.diassy@example.com' },
    update: {},
    create: {
      email: 'bakary.diassy@example.com',
      password: await bcrypt.hash('password789', 10),
      name: 'Bakary Diassy',
    },
  });

  console.log('✅ Users created:', { user1, user2, user3 });

  const todo1 = await prisma.todo.create({
    data: {
      title: 'Complete project documentation',
      description: 'Write comprehensive README and API documentation',
      completed: false,
      ownerId: user1.id,
    },
  });

  const todo2 = await prisma.todo.create({
    data: {
      title: 'Review code changes',
      description: 'Review pull requests and provide feedback',
      completed: true,
      ownerId: user1.id,
    },
  });

  const todo3 = await prisma.todo.create({
    data: {
      title: 'Set up CI/CD pipeline',
      description: 'Configure automated testing and deployment',
      completed: false,
      ownerId: user2.id,
      assignedToId: user1.id,
    },
  });

  const todo4 = await prisma.todo.create({
    data: {
      title: 'Database optimization',
      description: 'Optimize database queries and add indexes',
      completed: false,
      ownerId: user2.id,
    },
  });

  const todo5 = await prisma.todo.create({
    data: {
      title: 'Security audit',
      description: 'Perform security review of the application',
      completed: false,
      ownerId: user3.id,
      assignedToId: user2.id,
    },
  });

  console.log('✅ Todos created:', { todo1, todo2, todo3, todo4, todo5 });

  await prisma.todoLog.create({
    data: {
      action: 'created',
      todoId: todo1.id,
      userId: user1.id,
      details: 'Initial todo creation',
    },
  });

  await prisma.todoLog.create({
    data: {
      action: 'completed',
      todoId: todo2.id,
      userId: user1.id,
      details: 'Marked as completed',
    },
  });

  await prisma.todoLog.create({
    data: {
      action: 'assigned',
      todoId: todo3.id,
      userId: user2.id,
      details: `Assigned to ${user1.name}`,
    },
  });

  console.log('✅ Todo logs created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });