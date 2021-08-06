import colors from './colors';

export const formStyles = {
  textInp: {
    marginBottom: 6,
    borderRadius: 8,
  },
  picker: {
    borderColor: colors.GRAY_MEDIUM,
    borderRadius: 8,
    color: 'black',
    backgroundColor: colors.BACKGROUND,
    marginVertical: 6,
  },
  radioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingRight: 18,
  },
};

export const commonStyles = {
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#333',
  },
  modalView: {
    margin: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
};
