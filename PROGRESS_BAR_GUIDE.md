# 🎯 Interactive Progress Bar Guide

## 📋 Overview
Progress bar yang bisa digerakkan (interactive) memungkinkan user untuk mengupdate progress key result secara real-time dan melihat perubahan status indicator secara otomatis.

## 🚀 Fitur Utama

### 1. **Progress Bar yang Bisa Diklik**
- User bisa klik pada progress bar untuk masuk ke mode edit
- Hover effect menunjukkan bahwa progress bar bisa diinteraksi
- Visual indicator menunjukkan posisi progress saat ini

### 2. **Real-time Status Updates**
- Status otomatis berubah berdasarkan progress percentage
- **On-track** (≥70%): Hijau dengan icon trending up
- **At-risk** (40-69%): Kuning dengan icon alert triangle  
- **Off-track** (<40%): Merah dengan icon alert circle

### 3. **Smart Progress Calculation**
- Mendukung berbagai tipe target (angka, persentase, text)
- Progress dihitung otomatis berdasarkan current vs target
- Validasi input dan error handling

## 🛠️ Cara Kerja

### **A. User Interaction Flow**
```
1. User klik progress bar
   ↓
2. Mode edit terbuka
   ↓
3. User input nilai current
   ↓
4. Progress dan status dihitung otomatis
   ↓
5. User save perubahan
   ↓
6. Database terupdate
   ↓
7. UI refresh dengan data baru
```

### **B. Progress Calculation Logic**
```typescript
const calculateProgress = (currentValue: string, targetValue: string): number => {
  // Handle percentages
  if (targetValue.includes('%')) {
    const targetNum = parseFloat(targetValue.replace('%', ''));
    const currentNum = parseFloat(currentValue.replace('%', ''));
    return Math.min(Math.round((currentNum / targetNum) * 100), 100);
  }
  
  // Handle numbers
  if (!isNaN(Number(currentValue)) && !isNaN(Number(targetValue))) {
    const targetNum = parseFloat(targetValue);
    const currentNum = parseFloat(currentValue);
    return Math.min(Math.round((currentNum / targetNum) * 100), 100);
  }
  
  // Handle text-based targets
  return Math.min(Math.round((currentValue.length / targetValue.length) * 100), 100);
};
```

### **C. Status Calculation Logic**
```typescript
const calculateStatus = (progressValue: number): 'on-track' | 'at-risk' | 'off-track' => {
  if (progressValue >= 70) return 'on-track';
  if (progressValue >= 40) return 'at-risk';
  return 'off-track';
};
```

## 🎨 Visual Components

### **1. Progress Bar**
- Background: Gray (`bg-gray-200`)
- Progress fill: Dynamic color based on status
- Height: 12px (`h-3`)
- Border radius: Fully rounded (`rounded-full`)
- Hover effect: Blue overlay with opacity

### **2. Status Badge**
- **On-track**: Green background with trending up icon
- **At-risk**: Yellow background with alert triangle icon
- **Off-track**: Red background with alert circle icon
- Border and text colors match status theme

### **3. Progress Indicator**
- White dot indicator showing exact progress position
- Smooth transitions and animations
- Responsive to progress changes

## 📱 User Experience Features

### **A. Edit Mode**
- Form input untuk update current value
- Real-time preview progress dan status
- Save/Cancel buttons dengan loading states
- Error handling dan validation

### **B. Visual Feedback**
- Smooth transitions saat progress berubah
- Color changes berdasarkan status
- Loading spinner saat saving
- Success/error messages

### **C. Accessibility**
- Clickable progress bar dengan cursor pointer
- Hover effects untuk visual feedback
- Keyboard navigation support
- Screen reader friendly

## 🔧 Implementation Details

### **A. Component Structure**
```typescript
interface EditableProgressBarProps {
  keyResultId: string;
  title: string;
  current: string;
  target: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'off-track';
  onProgressUpdate: (newProgress: number, newStatus: string, newCurrent: string) => void;
}
```

### **B. State Management**
```typescript
const [isEditing, setIsEditing] = useState(false);
const [editCurrent, setEditCurrent] = useState(current);
const [isUpdating, setIsUpdating] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### **C. Database Integration**
```typescript
const { error: updateError } = await supabase
  .from('key_results')
  .update({
    current: editCurrent,
    progress: newProgress,
    status: newStatus,
    updated_at: new Date().toISOString()
  })
  .eq('id', keyResultId);
```

## 📊 Status Rules

| Progress Range | Status | Color | Icon | Description |
|----------------|--------|-------|------|-------------|
| 0-39% | Off-track | Red | Alert Circle | Progress sangat lambat, perlu perhatian khusus |
| 40-69% | At-risk | Yellow | Alert Triangle | Progress lambat, perlu monitoring |
| 70-100% | On-track | Green | Trending Up | Progress sesuai target |

## 🎯 Best Practices

### **1. Progress Updates**
- Update progress minimal mingguan
- Gunakan nilai yang akurat dan terukur
- Dokumentasikan perubahan progress

### **2. Status Monitoring**
- Monitor key result yang at-risk secara berkala
- Set up alerts untuk off-track items
- Review status secara regular

### **3. User Training**
- Jelaskan cara menggunakan interactive progress bar
- Berikan contoh input yang benar
- Latih user untuk regular updates

## 🚀 Future Enhancements

### **1. Advanced Features**
- Drag & drop progress adjustment
- Bulk progress updates
- Progress history tracking
- Automated status alerts

### **2. Analytics**
- Progress trend analysis
- Performance metrics
- Team comparison
- Predictive analytics

### **3. Integration**
- Calendar integration
- Email notifications
- Slack/Teams integration
- Mobile app support

## 🔍 Troubleshooting

### **Common Issues**

#### **Progress tidak terupdate**
- Check database connection
- Verify user permissions
- Check console for errors

#### **Status tidak berubah**
- Verify progress calculation logic
- Check status threshold values
- Ensure data types match

#### **UI tidak responsive**
- Check component state updates
- Verify callback functions
- Check React re-rendering

### **Debug Steps**
1. Check browser console for errors
2. Verify database updates
3. Check component props
4. Test with different input values
5. Verify calculation logic

## 📚 Related Components

- `OKRCard`: Parent component yang menggunakan EditableProgressBar
- `CreateOKRModal`: Modal untuk membuat OKR baru
- `CompanyOKR`: Page yang menampilkan company OKRs
- `MyOKR`: Page untuk personal OKRs

## 🎉 Conclusion

Interactive progress bar memberikan user experience yang lebih baik dengan:
- **Real-time updates** tanpa page refresh
- **Visual feedback** yang jelas dan intuitive
- **Automatic calculations** yang mengurangi human error
- **Professional appearance** yang modern dan responsive

Dengan fitur ini, tracking OKR progress menjadi lebih engaging dan efficient, membantu tim mencapai goals mereka dengan lebih baik.
