import * as React from 'react';
import {View, Text} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const db = SQLite.openDatabase(
      {
        name: 'database.db',
        location: 'default',
        createFromLocation: '~www/database.db',
      },
      () => {},
      error => {
        console.log(error);
      },
    );
    this.state = {
      db,
      users: [],
    };
  }

  render() {
    const {users} = this.state;
    console.log('user', users);
    return (
      <View>
        {users.map((e, index) => {
          return (
            <View style={{borderBottomWidth: 1}} key={e.username}>
              <Text>username: {e.username} </Text>
              <Text>password: {e.password} </Text>
            </View>
          );
        })}
      </View>
    );
  }

  componentDidMount() {
    const {db} = this.state;
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM user;', [], (tx, results) => {
        const rows = results.rows;
        let users = [];
        for (let i = 0; i < rows.length; i++) {
          users.push({
            ...rows.item(i),
          });
        }
        this.setState({users});
      });
    });
  }

  componentWillUnmount() {
    const {db} = this.state;
    db.close();
  }
}
