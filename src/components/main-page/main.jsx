import React, { useRef, useState, useEffect } from 'react'
import Tree from 'react-d3-tree'
import CustomNode from './CustomeNode'
import './style.scss'

function Main () {
  const treeContainer = useRef(null)
  const [background, setBackground] = useState('')
  const [visible, setVisible] = useState(false)
  const [backgroundInput, setBackgroundInput] = useState('')
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  const handleInputChange = event => {
    setBackgroundInput(event.target.value)
  }
  const changeBackground = () => {
    setBackground(backgroundInput)
  }
  const defaultFamilyTree = {
    name: 'Глава семьи',
    attributes: {
      age: 50,
      img: 'https://via.placeholder.com/40'
    },
    children: [
      {
        name: 'Ребенок 1',
        attributes: { age: 25, img: 'https://via.placeholder.com/40' },
        children: [
          {
            name: 'Внук 1',
            attributes: { age: 5, img: 'https://via.placeholder.com/40' }
          },
          {
            name: 'Внук 2',
            attributes: { age: 3, img: 'https://via.placeholder.com/40' }
          }
        ]
      },
      {
        name: 'Ребенок 2',
        attributes: { age: 22, img: 'https://via.placeholder.com/40' },
        children: [
          {
            name: 'Внук 3',
            attributes: { age: 2, img: 'https://via.placeholder.com/40' }
          },
          {
            name: 'Внук 4',
            attributes: { age: 1, img: 'https://via.placeholder.com/40' }
          }
        ]
      }
    ]
  }

  const [familyTree, setFamilyTree] = useState(() => {
    const savedTree = localStorage.getItem('familyTree')
    return savedTree ? JSON.parse(savedTree) : defaultFamilyTree
  })

  // Сохранение familyTree в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('familyTree', JSON.stringify(familyTree))
  }, [familyTree])

  useEffect(() => {
    const handleResize = () => {
      if (treeContainer.current) {
        setDimensions({
          width: treeContainer.current.offsetWidth,
          height: treeContainer.current.offsetHeight
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Функции для добавления, удаления и редактирования узлов
  const addNode = (currentNode, parentName, newNode) => {
    if (currentNode.name === parentName) {
      if (!currentNode.children) {
        currentNode.children = []
      }
      currentNode.children.push(newNode)
      return true
    }

    if (currentNode.children) {
      for (let child of currentNode.children) {
        if (addNode(child, parentName, newNode)) {
          return true
        }
      }
    }

    return false
  }

  const removeNode = (currentNode, nodeName) => {
    if (!currentNode.children) return false

    const index = currentNode.children.findIndex(
      child => child.name === nodeName
    )
    if (index !== -1) {
      currentNode.children.splice(index, 1)
      return true
    }

    for (let child of currentNode.children) {
      if (removeNode(child, nodeName)) {
        return true
      }
    }

    return false
  }

  const editNode = (currentNode, nodeName, updatedData) => {
    if (currentNode.name === nodeName) {
      Object.assign(currentNode.attributes, updatedData)
      return true
    }

    if (currentNode.children) {
      for (let child of currentNode.children) {
        if (editNode(child, nodeName, updatedData)) {
          return true
        }
      }
    }

    return false
  }

  const handleAddNode = () => {
    const parentName = prompt('Введите имя родителя:')
    if (!parentName) {
      alert('Имя родителя обязательно.')
      return
    }
    const newName = prompt('Введите имя нового члена семьи:')
    if (!newName) {
      alert('Имя нового члена семьи обязательно.')
      return
    }
    const newAge = prompt('Введите возраст:')
    if (!newAge || isNaN(newAge)) {
      alert('Корректный возраст обязателен.')
      return
    }
    const newImg = prompt('Введите ссылку на изображение:')

    const newNode = {
      name: newName,
      attributes: {
        age: parseInt(newAge),
        img: newImg || 'https://via.placeholder.com/40'
      },
      children: []
    }

    setFamilyTree(prevTree => {
      const newTree = JSON.parse(JSON.stringify(prevTree))
      const added = addNode(newTree, parentName, newNode)
      if (!added) {
        alert('Родитель не найден.')
      }
      return newTree
    })
  }

  const handleRemoveNode = () => {
    const nodeName = prompt('Введите имя члена семьи для удаления:')
    if (!nodeName) {
      alert('Имя обязательно.')
      return
    }

    setFamilyTree(prevTree => {
      const newTree = JSON.parse(JSON.stringify(prevTree))
      const removed = removeNode(newTree, nodeName)
      if (!removed) {
        alert('Узел не найден или невозможно удалить.')
      }
      return newTree
    })
  }

  const handleEditNode = () => {
    const nodeName = prompt('Введите имя члена семьи для редактирования:')
    if (!nodeName) {
      alert('Имя обязательно.')
      return
    }
    const newAge = prompt('Введите новый возраст:')
    if (!newAge || isNaN(newAge)) {
      alert('Корректный возраст обязателен.')
      return
    }
    const newImg = prompt('Введите новую ссылку на изображение:')

    const updatedData = {
      age: parseInt(newAge),
      img: newImg || 'https://via.placeholder.com/40'
    }

    setFamilyTree(prevTree => {
      const newTree = JSON.parse(JSON.stringify(prevTree))
      const edited = editNode(newTree, nodeName, updatedData)
      if (!edited) {
        alert('Узел не найден.')
      }
      return newTree
    })
  }

  return (
    <div
      className='App'
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh'
      }}
    >
      <h1>Древо семьи</h1>
      <button
        onClick={() => {
          setVisible(!visible)
        }}
        style={{ background: 'none', border: 'none' }}
      >
        <img src='pngegg (5).png' alt='' width='80px' />
      </button>
      <div className='controls' style={{ display: visible ? 'block' : 'none' }}>
        <button onClick={handleAddNode}>Добавить узел</button>
        <button onClick={handleRemoveNode}>Удалить узел</button>
        <button onClick={handleEditNode}>Редактировать узел</button>
      </div>
      <div ref={treeContainer} style={{ width: '100%', height: '80vh' }}>
        <Tree
          data={familyTree}
          translate={{ x: dimensions.width / 2, y: 50 }}
          orientation='vertical'
          pathFunc='elbow'
          separation={{ siblings: 1, nonSiblings: 2 }}
          renderCustomNodeElement={rd3tProps => <CustomNode {...rd3tProps} />}
          styles={{
            links: {
              stroke: '#000',
              strokeWidth: 2
            },
            nodes: {
              node: {
                circle: {
                  stroke: '#000',
                  strokeWidth: 2
                },
                name: {
                  stroke: 'none',
                  fill: '#555',
                  fontSize: '14px',
                  fontWeight: 'bold'
                },
                attributes: {
                  stroke: 'none',
                  fill: '#777',
                  fontSize: '12px'
                }
              },
              leafNode: {
                circle: {
                  stroke: '#000',
                  strokeWidth: 2
                },
                name: {
                  stroke: 'none',
                  fill: '#555',
                  fontSize: '14px',
                  fontWeight: 'bold'
                },
                attributes: {
                  stroke: 'none',
                  fill: '#777',
                  fontSize: '12px'
                }
              }
            }
          }}
        />
      </div>
      <div className='backgroundLink'>
        <input
          type='text'
          value={backgroundInput}
          className='backgroundSrc'
          onChange={handleInputChange}
        />
        <button onClick={changeBackground}>Change Background</button>
      </div>
    </div>
  )
}

export default Main
