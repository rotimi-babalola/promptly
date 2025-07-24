export interface WritePageState {
  inputText: string;
  correctedText: string | null;
  loading: boolean;
  error: string | null;
}

export type WritePageAction =
  | { type: 'SET_INPUT_TEXT'; payload: string }
  | { type: 'SET_CORRECTED_TEXT'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR' };

export const initialWritePageState: WritePageState = {
  inputText: '',
  correctedText: null,
  loading: false,
  error: null,
};

export const writePageReducer = (
  state: WritePageState,
  action: WritePageAction,
): WritePageState => {
  switch (action.type) {
    case 'SET_INPUT_TEXT':
      return { ...state, inputText: action.payload };
    case 'SET_CORRECTED_TEXT':
      return { ...state, correctedText: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR':
      return { ...state, inputText: '', correctedText: null, error: null };
    default:
      return state;
  }
};
