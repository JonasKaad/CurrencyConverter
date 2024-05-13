import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from '../constants/colors';

const AppButton = ({onPress, title}: any) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default AppButton;

const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 4,
    backgroundColor: colors.PRIMARY,
    borderRadius: 10,
    paddingVertical: 6,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
