import { StyleSheet, StatusBar, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight || 25, // Extra padding for iOS notch and Android status bar
    paddingHorizontal: 20, // Consistent side padding for both iOS and Android
    backgroundColor: '#f9f9f9', // Light background for a clean look
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25, // Increased spacing for better separation
    marginTop: Platform.OS === 'ios' ? 30 : 15, // Adjust for iOS notch
    paddingHorizontal: 20, // Ensure navbar content is aligned properly
  },
  header: {
    fontSize: 30, // Larger font for a bold statement
    fontWeight: '800', // Extra bold for emphasis
    color: '#333', // Neutral color for better contrast
  },
  navIcons: {
    flexDirection: 'row', // Align icons horizontally
    alignItems: 'center', // Center icons vertically
  },
  icon: {
    marginHorizontal: 10, // Add spacing between icons
  },
  searchBar: {
    borderWidth: 0, // Removed border for a cleaner look
    borderRadius: 15, // Smooth rounded corners
    padding: 16,
    marginBottom: 25,
    fontSize: 16,
    backgroundColor: '#fff', // White background for contrast
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Shadow for Android
    marginHorizontal: 10, // Add horizontal margin to prevent stretching
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginHorizontal: 10, // Add horizontal margin for consistent alignment
  },
  dropdownLabel: {
    fontSize: 18,
    fontWeight: '600', // Semi-bold for better readability
    marginRight: 15,
    color: '#555', // Subtle color for labels
  },
  dropdown: {
    borderWidth: 0,
    borderRadius: 15,
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40, // Increased margin for better spacing
  },
  emptyText: {
    fontSize: 20, // Larger font for better visibility
    color: '#aaa', // Subtle color for empty state
    fontStyle: 'italic', // Italic for a softer tone
  },
  recommendButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    marginHorizontal: 10, // Add horizontal margin for consistent alignment
  },
  recommendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700', // Bold for emphasis
    textTransform: 'uppercase', // Uppercase for a modern look
    letterSpacing: 1, // Slight spacing for better readability
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay for focus
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20, // Smooth rounded corners
    padding: 25,
    backgroundColor: '#fff', // Clean white background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24, // Larger font for better visibility
    fontWeight: '800', // Extra bold for emphasis
    color: '#333',
  },
  bottomNavbar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30, // Adjust for iOS and Android navigation buttons
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15, // Rounded corners for a modern look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomNavbarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavbarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
});