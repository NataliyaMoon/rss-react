import { useDispatch, useSelector } from 'react-redux';
import { clearSelection } from './slices/peopleSlice';
import type { RootState } from './../store';
import './SelectionBar.css';

export default function SelectionBar() {
  const dispatch = useDispatch();
  const selectedCount = Object.keys(useSelector((state: RootState) => state.people.selected)).length;

  if (selectedCount === 0) return null;

  const handleClear = () => {
    dispatch(clearSelection());
  };

  const handleDownload = () => {
    
  };

  return (
    <div className="selection-bar">
      <span className="selection-bar__text">{selectedCount} item(-s) are selected</span>
      <button className="selection-bar__button" onClick={handleClear}>
        Unselect all
      </button>
      <button className="selection-bar__button" onClick={handleDownload}>
        Download
      </button>
    </div>
  );
}
