import {StyleSheet} from 'react-native';

export const dayTimeStyles = StyleSheet.create({
  visibleContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  daysBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    backgroundColor: '#364040',
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  dayItemActive: {
    backgroundColor: '#3EB1CC',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  dayTitleActive: {
    color: '#000',
  },
  selectedDaysContainer: {
    marginTop: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#364040',
    borderRadius: 12,
  },
  listItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});
