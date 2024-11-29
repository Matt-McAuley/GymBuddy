import {View, Text, StyleSheet, ScrollView} from "react-native";
import {Dropdown} from "react-native-element-dropdown";

export default function AddProgram() {
    return (
        <ScrollView className={'p-4'}>
            <Dropdown style={styles.dropdown} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                      label={'Scheme'}
                      data={[
                          {label: '5 x 5', value: '5 x 5'},
                          {label: '5 x 3', value: '5 x 3'},
                          {label: '5 3 1', value: '5 3 1'},
                      ]}
                      labelField='label' valueField='value' placeholder={'Enter Name'}
                      value={''} renderRightIcon={() => null}
                      renderItem={(item) => (
                          <View style={styles.item}>
                              <Text style={styles.itemText}>{item.label}</Text>
                          </View>)}
                      onChange={(item) => {}}/>

            {
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                return <Dropdown style={styles.dropdown} selectedTextStyle={styles.selected} placeholderStyle={styles.placeholder}
                          label={day}
                          data={[
                              {label: '5 x 5', value: '5 x 5'},
                              {label: '5 x 3', value: '5 x 3'},
                              {label: '5 3 1', value: '5 3 1'},
                          ]}
                          labelField='label' valueField='value' placeholder={`Enter ${day}`}
                          value={''} renderRightIcon={() => null}
                          renderItem={(item) => (
                              <View style={styles.item}>
                                  <Text style={styles.itemText}>{item.label}</Text>
                              </View>)}
                          onChange={(item) => {}}/>
                })
            }

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        width: '100%',
        height: 90,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderColor: 'black',
        borderWidth: 3,
        marginBottom: 10,
    },
    selected: {
        color: 'black',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
    item: {
        padding: 10,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
    },
    placeholder: {
        color: 'black',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    }
});
