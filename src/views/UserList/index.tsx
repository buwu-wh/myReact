import { FixedSizeList as List } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import style from './UserList.module.css';
// 数据
const users = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  email: `user${i}@example.com`,
}));

const Row = ({ index, style }: ListChildComponentProps) => {
  return (
    <div style={style}>
      name: {users[index].name} 啊email: {users[index].email}
      name: {users[index].name} 啊email: {users[index].email}
      name: {users[index].name} 啊email: {users[index].email}
      name: {users[index].name} 啊email: {users[index].email}
      name: {users[index].name} 啊email: {users[index].email}
      name: {users[index].name} 啊email: {users[index].email}
    </div>
  );
};

function UserList() {
  return (
    <div className={style['user-list']}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height} // 必须提供
            width={width} // 必须提供
            itemCount={users.length}
            itemSize={50}
            children={Row}
          ></List>
        )}
      </AutoSizer>
    </div>
  );
}

export default UserList;
