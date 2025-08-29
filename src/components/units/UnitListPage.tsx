import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ChevronDown, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { Unit } from '../../types';
import * as api from '../../lib/api';
import UnitCard from './UnitCard';
import CreateUnitModal from './CreateUnitModal';
import EditUnitModal from './EditUnitModal';

const UnitListPage: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const fetchedUnits = await api.getUnits();
      setUnits(fetchedUnits);
    } catch (error) {
      toast.error('Failed to fetch units.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleCreateUnit = () => {
    toast.success('Unit created successfully!');
    fetchUnits(); // Refetch all units to get the new one
  };

  const handleUpdateUnit = () => {
    toast.success('Unit updated successfully!');
    setEditingUnit(null);
    fetchUnits(); // Refetch to show changes
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await api.deleteUnit(unitId);
        toast.success('Unit deleted successfully.');
        setUnits(prev => prev.filter(u => u.id !== unitId));
      } catch (error) {
        toast.error('Failed to delete unit.');
      }
    }
  };

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchesSearch = unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            unit.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = filterCourse === 'All' || unit.course === filterCourse;
      return matchesSearch && matchesCourse;
    });
  }, [units, searchTerm, filterCourse]);

  const courses = ['All', ...Array.from(new Set(units.map(u => u.course)))];

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Units</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and organize your units</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors min-h-[44px]"
        >
          <Plus className="w-5 h-5" />
          Create Unit
        </motion.button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="appearance-none w-full md:w-48 pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          >
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateUnitModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={handleCreateUnit}
          />
        )}
        {editingUnit && (
          <EditUnitModal
            unit={editingUnit}
            onClose={() => setEditingUnit(null)}
            onSave={handleUpdateUnit}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto -mr-2 pr-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUnits.map((unit, index) => (
                <UnitCard key={unit.id} unit={unit} index={index} onEdit={setEditingUnit} onDelete={handleDeleteUnit} />
              ))}
            </div>
            {filteredUnits.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No units found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter, or create a new unit.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UnitListPage;
