import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import storage from 'redux-persist/lib/storage';
import MetaMaskReducer from '../features/MetaMaskSlice';
import OrganisationSettingsReducer from "@/features/OrganisationSettingsSlice";
import TenantReducer from "@/features/TenantSlice";
import UserReducer from '../features/LoginSlice';
import PrivyReducer from '../features/PrivySlice';
import FileUploadCompleteReducer from '../features/FileUploadCompleteSlice';
import CountsReducer from '../features/CountsSlice';
import FileInfoReducer from '../features/FileInfoSlice';
import SessionReducer from '../features/SessionSlice';



const reducers = combineReducers({
  metaMask: MetaMaskReducer,
  organisationSettings:OrganisationSettingsReducer,
  tenant: TenantReducer,
  user: UserReducer,
  privy: PrivyReducer,
  FileUploadComplete: FileUploadCompleteReducer,
  counts: CountsReducer,
  fileInfo: FileInfoReducer,
  session: SessionReducer,
  
})
const persistReducers = persistReducer(
  {
    key: 'account',
    storage,
    keyPrefix: 'newwww-'
  },
  reducers,
)
const store = configureStore({
  reducer: persistReducers,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persister = persistStore(store);

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;


