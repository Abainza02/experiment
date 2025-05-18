// frontend/src/pages/PopularRecipesPage.jsx
import { useEffect, useState } from 'react';
import { getPopularRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaHeart, FaStar, FaComment } from 'react-icons/fa';

const PopularRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;
  const navigate = useNavigate();

  const fetchPopularRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPopularRecipes(currentPage, limit);
      
      if (response.success) {
        setRecipes(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      } else {
        throw new Error(response.error || 'Failed to load popular recipes');
      }
    } catch (error) {
      console.error('Failed to load popular recipes:', error);
      setError(error.message || 'Failed to load popular recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularRecipes();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div className="loading">Loading popular recipes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <div className="popular-header">
        <h1><FaFire /> Popular Recipes</h1>
        <p>Most loved recipes in our community</p>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p>No popular recipes found</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse All Recipes
          </button>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <RecipeCard 
                key={recipe._id} 
                recipe={recipe}
                showStats={true}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default PopularRecipesPage;