import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { GlobalColors } from '../styles/Colors';
import { globalStyles } from '../Resources';

const DropdownComponent = ({ data, label, placeholder, onValueChange, value }: any) => {
    return (
        <View style={[globalStyles.fullWidth, globalStyles.mBottom20]}>
            <Dropdown
                style={[
                    styles.dropdown,
                    value ? { borderColor: GlobalColors.colors.primaryColor } : { borderColor: GlobalColors.colors.lightGrey }
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={[{ label: placeholder, value: '' }, ...data]} // Add placeholder as first option
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                searchPlaceholder="Search..."
                value={value} // Controlled value from the parent component
                onChange={(item) => onValueChange(item.value)} // Pass selected value to parent
                dropdownPosition="auto"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        width: '100%',
        backgroundColor: '#eee',
        borderColor: GlobalColors.colors.black,
        color: GlobalColors.colors.black,
        borderWidth: 0.5,
        borderRadius: 3,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 16,
        color: GlobalColors.colors.black
    },
    selectedTextStyle: {
        fontSize: 16,
        color: GlobalColors.colors.black
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: GlobalColors.colors.black
    },
});

export default DropdownComponent;
