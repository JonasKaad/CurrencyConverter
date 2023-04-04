import {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Item = ({name, cur}: any) => {
  return (
    <View>
      <View style={styles.item}>
        <Text style={styles.title}>{cur + ' - ' + name}</Text>
      </View>
    </View>
  );
};

export default memo(Item);

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    color: '#fff',
  },
});
