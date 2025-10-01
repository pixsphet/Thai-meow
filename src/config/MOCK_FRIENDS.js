// mockData.js (ไฟล์แยก หรือจะใส่ในไฟล์นี้ก็ได้)
const MOCK_FRIENDS = [
  { id: 1, name: "Nong Mae", username: "mae123" },
  { id: 2, name: "Boss", username: "boss42" },
  { id: 3, name: "Mimi", username: "mimi_cat" },
];

// แล้วใน searchFriends เปลี่ยนเป็น
const searchFriends = async (searchText) => {
  setLoading(true);
  try {
    const filtered = MOCK_FRIENDS.filter((f) =>
      f.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFriends(filtered);
  } catch (error) {
    console.error("Mock error:", error);
    setFriends([]);
  } finally {
    setLoading(false);
  }
};
