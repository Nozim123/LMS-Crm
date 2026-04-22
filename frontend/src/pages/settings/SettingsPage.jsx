import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { i18n } = useTranslation();

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">Settings & Localization</h2>
      <div className="bg-white p-4 rounded shadow max-w-sm">
        <label className="block text-sm mb-2">Language</label>
        <select className="input" defaultValue="en" onChange={(e) => i18n.changeLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="ru">Русский</option>
          <option value="uz">O'zbek</option>
        </select>
      </div>
    </div>
  );
}
