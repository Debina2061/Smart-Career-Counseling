import { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout';
import { careerAPI } from '../../utils/api';

const emptyForm = {
  careerName: '',
  category: 'technology',
  experienceLevel: 'entry',
  marketDemand: 'medium',
  growthOutlook: 'stable',
  description: '',
  requiredSkillsTech: '',
  requiredSkillsSoft: '',
  preferredEducationLevels: [],
  experienceMin: '',
  experienceMax: '',
  salaryMin: '',
  salaryMax: '',
  certifications: '',
  workEnvironment: [],
};

const educationLevels = ['secondary', 'bachelor', 'master', 'phd', 'any'];
const workEnvironments = ['remote', 'hybrid', 'onsite', 'travel'];

const splitList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

function CareerManagement() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadCareers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await careerAPI.getAllCareers({ limit: 100 });
      const payload = response?.data || response;
      setCareers(payload?.careers || []);
    } catch (err) {
      setError(err.message || 'Failed to load careers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareers();
  }, []);

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleArrayValue = (field, value) => {
    setFormData((prev) => {
      const list = prev[field];
      if (list.includes(value)) {
        return { ...prev, [field]: list.filter((item) => item !== value) };
      }
      return { ...prev, [field]: [...list, value] };
    });
  };

  const handleEdit = async (careerId) => {
    setMessage('');
    setError('');
    try {
      const response = await careerAPI.getCareerDetails(careerId);
      const payload = response?.data || response;
      const career = payload?.data || payload;
      setEditingId(career._id);
      setFormData({
        careerName: career.careerName || '',
        category: career.category || 'technology',
        experienceLevel: career.experienceLevel || 'entry',
        marketDemand: career.marketDemand || 'medium',
        growthOutlook: career.growthOutlook || 'stable',
        description: career.description || '',
        requiredSkillsTech: (career.requiredSkills?.technical || []).join(', '),
        requiredSkillsSoft: (career.requiredSkills?.soft || []).join(', '),
        preferredEducationLevels: (career.preferredEducation || []).map((e) => e.level).filter(Boolean),
        experienceMin: career.experienceYearsRange?.min?.toString() || '',
        experienceMax: career.experienceYearsRange?.max?.toString() || '',
        salaryMin: career.salaryRange?.min?.toString() || '',
        salaryMax: career.salaryRange?.max?.toString() || '',
        certifications: (career.certifications || []).join(', '),
        workEnvironment: career.workEnvironment || [],
      });
    } catch (err) {
      setError(err.message || 'Failed to load career details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      careerName: formData.careerName,
      category: formData.category,
      experienceLevel: formData.experienceLevel,
      marketDemand: formData.marketDemand,
      growthOutlook: formData.growthOutlook,
      description: formData.description,
      requiredSkills: {
        technical: splitList(formData.requiredSkillsTech),
        soft: splitList(formData.requiredSkillsSoft),
      },
      preferredEducation: formData.preferredEducationLevels.map((level) => ({
        level,
        fields: [],
      })),
      experienceYearsRange: {
        min: formData.experienceMin ? Number(formData.experienceMin) : 0,
        max: formData.experienceMax ? Number(formData.experienceMax) : 99,
      },
      salaryRange: {
        min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        currency: 'USD',
      },
      certifications: splitList(formData.certifications),
      workEnvironment: formData.workEnvironment,
    };

    try {
      if (editingId) {
        await careerAPI.updateCareer(editingId, payload);
        setMessage('Career updated successfully.');
      } else {
        await careerAPI.createCareer(payload);
        setMessage('Career created successfully.');
      }
      resetForm();
      loadCareers();
    } catch (err) {
      setError(err.message || 'Failed to save career');
    }
  };

  const handleDelete = async (careerId) => {
    setError('');
    setMessage('');
    try {
      await careerAPI.deleteCareer(careerId);
      setMessage('Career removed successfully.');
      loadCareers();
    } catch (err) {
      setError(err.message || 'Failed to delete career');
    }
  };

  return (
    <AdminLayout title="Career Profiles" eyebrow="Career Management">
      {(error || message) && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${error ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">{editingId ? 'Edit Career' : 'Create Career'}</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-slate-700">Career Name</label>
              <input
                type="text"
                name="careerName"
                value={formData.careerName}
                onChange={handleChange}
                required
                className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="engineering">Engineering</option>
                  <option value="creative">Creative</option>
                  <option value="business">Business</option>
                  <option value="science">Science</option>
                  <option value="legal">Legal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Experience Level</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">Market Demand</label>
                <select
                  name="marketDemand"
                  value={formData.marketDemand}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="very-high">Very High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Growth Outlook</label>
                <select
                  name="growthOutlook"
                  value={formData.growthOutlook}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="declining">Declining</option>
                  <option value="stable">Stable</option>
                  <option value="growing">Growing</option>
                  <option value="rapid-growth">Rapid Growth</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Technical Skills (comma separated)</label>
              <input
                type="text"
                name="requiredSkillsTech"
                value={formData.requiredSkillsTech}
                onChange={handleChange}
                className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Soft Skills (comma separated)</label>
              <input
                type="text"
                name="requiredSkillsSoft"
                value={formData.requiredSkillsSoft}
                onChange={handleChange}
                className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Preferred Education</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {educationLevels.map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => toggleArrayValue('preferredEducationLevels', level)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      formData.preferredEducationLevels.includes(level)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">Experience Years (Min)</label>
                <input
                  type="number"
                  name="experienceMin"
                  value={formData.experienceMin}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Experience Years (Max)</label>
                <input
                  type="number"
                  name="experienceMax"
                  value={formData.experienceMax}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">Salary Min</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Salary Max</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Certifications (comma separated)</label>
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Work Environment</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {workEnvironments.map((env) => (
                  <button
                    type="button"
                    key={env}
                    onClick={() => toggleArrayValue('workEnvironment', env)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      formData.workEnvironment.includes(env)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold"
              >
                <FaPlus />
                {editingId ? 'Update Career' : 'Create Career'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="xl:col-span-3 bg-white/90 rounded-2xl shadow-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">Career Library</h3>
            <button
              onClick={loadCareers}
              className="text-sm font-semibold text-teal-600"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Loading careers...</p>
          ) : careers.length === 0 ? (
            <p className="text-sm text-slate-500">No careers found.</p>
          ) : (
            <div className="space-y-3">
              {careers.map((career) => (
                <div key={career._id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{career.careerName}</p>
                    <p className="text-xs text-slate-500">{career.category} · {career.experienceLevel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(career._id)}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(career._id)}
                      className="px-3 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default CareerManagement;
