import {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const RenderItem = item => {
  return (
    <View style={styles.dropItem}>
      <Text style={styles.textItem}>{item.label + ' - ' + item.value}</Text>
      {item.value === value}
    </View>
  );
};

const styles = StyleSheet.create({
  dropItem: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
});
export default memo(RenderItem);
