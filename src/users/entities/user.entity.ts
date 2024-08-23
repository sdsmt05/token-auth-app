import { Column, Entity, ObjectId, ObjectIdColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['username'])
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  refreshToken?: string;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
