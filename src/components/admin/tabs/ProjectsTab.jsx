import React, { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, AlertCircle } from "lucide-react";
import { projectsService } from "../../../services/projectsService";
import ProjectIcon from "../../ProjectIcon";
import ProjectForm from "../forms/ProjectForm";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { SectionLoader } from "../../ui/LoadingSpinner";

export default function ProjectsTab() {
  const { profile } = useAuth();
  const role = profile?.role;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectsService.getProjects();
      setProjects(data || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los proyectos. Inténtalo de nuevo más tarde.");
      toast.error("No se pudieron cargar los proyectos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenCreate = () => {
    setCurrentProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        const updated = await projectsService.updateProject(
          formData.id,
          formData,
          role,
        );
        setProjects((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
        toast.success("Proyecto actualizado con éxito");
      } else {
        const created = await projectsService.createProject(formData, role);
        setProjects((prev) => [...prev, created]);
        toast.success("Proyecto creado con éxito");
      }
      return true;
    } catch (err) {
      console.error("Error saving project:", err);
      toast.error("Ocurrió un error al guardar el proyecto. Revisa los datos.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este proyecto de manera permanente? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }
    try {
      await projectsService.deleteProject(id, role);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Proyecto eliminado con éxito");
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("No se pudo eliminar el proyecto.");
    }
  };

  // Filtrado de proyectos por búsqueda
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <SectionLoader message="Cargando listado de proyectos..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            Gestión de Proyectos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Administra los proyectos sociales que se muestran en el sitio web de
            EDU-US
          </p>
        </div>

        <button type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Total: {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "proyecto" : "proyectos"}
        </div>
      </div>

      {/* Contenido principal */}
      {error ? (
        <div className="p-6 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/50 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700/60">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {searchTerm
              ? "No se encontraron proyectos para tu búsqueda."
              : "No hay proyectos registrados en el sistema."}
          </p>
          {!searchTerm && (
            <button type="button"
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-2 text-primary font-bold hover:underline"
            >
              Comienza creando uno aquí <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                  <th className="py-4 px-6">Proyecto</th>
                  <th className="py-4 px-6 text-center">Icono</th>
                  <th className="py-4 px-6">Descripción</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                  >
                    {/* Nombre y Foto Principal */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.fondo}
                          alt={project.name}
                          className="w-16 h-12 object-cover rounded-lg border border-gray-100 dark:border-gray-600 bg-gray-50 flex-shrink-0"
                        />
                        <span className="font-bold text-gray-950 dark:text-white">
                          {project.name}
                        </span>
                      </div>
                    </td>

                    {/* Icono Lucide */}
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <ProjectIcon name={project.icon} className="w-5 h-5" />
                      </div>
                    </td>

                    {/* Descripción corta */}
                    <td className="py-4 px-6 max-w-xs truncate text-gray-600 dark:text-gray-300">
                      {project.description}
                    </td>

                    {/* Botones de acción */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button"
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Editar proyecto"
                        >
                          <Pencil className="w-4.5 h-4.5" />
                        </button>
                        <button type="button"
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Eliminar proyecto"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isModalOpen && (
        <ProjectForm
          project={currentProject}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
