import React, {useState} from 'react';
import IconIo from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-elements';

const App = () => {
  let initTodoList = [
    {title: 'Yemek Ye', complate: false},
    {title: 'Spor Yap', complate: true},
    {title: 'Calis', complate: true},
    {title: 'Uyu', complate: false},
  ];
  const [todoTitle, setTodoTitle] = useState('');
  const [todoList, settodoList] = useState(initTodoList);
  const addTodo = () => {
    let data = {title:todoTitle, complate:false};
    let newList = todoList;
    newList.push(data);
    settodoList(newList);
    setTodoTitle('');
  }
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>
          <TextInput
            onChangeText={value => setTodoTitle(value)}
            value={todoTitle}
            style={{
              width: '100%',
              borderColor: '#00f',
              borderWidth: 1,
            }}
          />
        </View>
      </SafeAreaView>
      <View style={{flex: 3}}>
        <ScrollView style={{flex: 1, width: '100%'}}>
          {todoList.map((todo, index) => (
            <>
              <TouchableOpacity
                style={{
                  width: '90%',
                  height: 60,
                  borderColor: todo.complate ? '#0f0' : '#f00',
                  borderWidth: 1,
                  margin: 10,
                  borderRadius: 20,
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
                key={index.toString()}>
                <Text style={{padding: 10}}>{todo.title}</Text>
                <IconIo
                  name={
                    todo.complate
                      ? 'checkbox-marked-outline'
                      : 'checkbox-blank-outline'
                  }
                  size={32}
                  color={todo.complate ? '#0f0' : '#f00'}
                />
              </TouchableOpacity>
            </>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() => addTodo()}
        style={{
          width: 60,
          height: 60,
          backgroundColor: '#00f',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 30,
          position: 'absolute',
          right: 30,
          bottom: 30,
        }}>
        <Text style={{color: '#fff', fontSize: 42}}>+</Text>
      </TouchableOpacity>
    </>
  );
};

export default App;
